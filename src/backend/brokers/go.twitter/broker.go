/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package twitter_broker

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/Notifications"
	"github.com/CaliOpen/go-twitter/twitter"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
)

type (
	TwitterBroker struct {
		Config            BrokerConfig
		Connectors        TwitterBrokerConnectors
		Index             backends.LDAIndex
		NatsConn          *nats.Conn
		Notifier          Notifications.Notifiers
		Store             backends.LDAStore
		natsSubscriptions []*nats.Subscription
	}

	BrokerConfig struct {
		IndexConfig      IndexConfig `mapstructure:"index_settings"`
		IndexName        string      `mapstructure:"index_name"`
		NatsQueue        string      `mapstructure:"nats_queue"`
		NatsURL          string      `mapstructure:"nats_url"`
		NatsTopicWorkers string      `mapstructure:"nats_topic_worker"`
		NatsTopicDMs     string      `mapstructure:"nats_topic_direct_message"`
		StoreConfig      StoreConfig `mapstructure:"store_settings"`
		StoreName        string      `mapstructure:"store_name"`
		LDAConfig        LDAConfig   `mapstructure:"LDAConfig"`
	}

	natsOrder struct {
		MessageId string `json:"message_id"`
		Order     string `json:"order"`
		UserId    string `json:"user_id"`
	}

	DMpayload struct {
		DM       *twitter.DirectMessageEvent
		Response chan *DeliveryAck
	}

	TwitterBrokerConnectors struct {
		Egress chan *DMpayload
		Halt   chan struct{}
	}
)

func Initialize(conf BrokerConfig) (broker *TwitterBroker, err error) {
	var e error
	broker = new(TwitterBroker)
	broker.Config = conf
	switch conf.StoreName {
	case "cassandra":
		c := store.CassandraConfig{
			Hosts:       conf.StoreConfig.Hosts,
			Keyspace:    conf.StoreConfig.Keyspace,
			Consistency: gocql.Consistency(conf.StoreConfig.Consistency),
			SizeLimit:   conf.StoreConfig.SizeLimit,
			UseVault:    conf.StoreConfig.UseVault,
		}
		if conf.StoreConfig.ObjectStore == "s3" {
			c.WithObjStore = true
			c.Endpoint = conf.StoreConfig.OSSConfig.Endpoint
			c.AccessKey = conf.StoreConfig.OSSConfig.AccessKey
			c.SecretKey = conf.StoreConfig.OSSConfig.SecretKey
			c.RawMsgBucket = conf.StoreConfig.OSSConfig.Buckets["raw_messages"]
			c.AttachmentBucket = conf.StoreConfig.OSSConfig.Buckets["temporary_attachments"]
			c.Location = conf.StoreConfig.OSSConfig.Location
		}
		if conf.StoreConfig.UseVault {
			c.HVaultConfig.Url = conf.StoreConfig.VaultConfig.Url
			c.HVaultConfig.Username = conf.StoreConfig.VaultConfig.Username
			c.HVaultConfig.Password = conf.StoreConfig.VaultConfig.Password
		}
		b, e := store.InitializeCassandraBackend(c)
		if e != nil {
			err = e
			log.WithError(err).Warnf("[EmailBroker] initalization of %s backend failed", conf.StoreName)
			return
		}

		broker.Store = backends.LDAStore(b) // type conversion to LDA interface
	default:
		log.Warnf("[EmailBroker] unknown store backend: %s", conf.StoreName)
		err = errors.New("[EmailBroker] unknown store backend")
		return
	}
	broker.NatsConn, e = nats.Connect(conf.NatsURL)
	if e != nil {
		err = e
		log.WithError(err).Warn("[EmailBroker] initalization of NATS connexion failed")
		return
	}
	caliopenConfig := CaliopenConfig{
		NotifierConfig: conf.LDAConfig.NotifierConfig,
		NatsConfig: NatsConfig{
			Url: conf.NatsURL,
		},
		RESTstoreConfig: RESTstoreConfig{
			BackendName:  conf.StoreName,
			Consistency:  conf.StoreConfig.Consistency,
			Hosts:        conf.StoreConfig.Hosts,
			Keyspace:     conf.StoreConfig.Keyspace,
			OSSConfig:    conf.StoreConfig.OSSConfig,
			ObjStoreType: conf.StoreConfig.ObjectStore,
			SizeLimit:    conf.StoreConfig.SizeLimit,
		},
		RESTindexConfig: RESTIndexConfig{
			Hosts:     conf.LDAConfig.IndexConfig.Urls,
			IndexName: conf.LDAConfig.IndexName,
		},
	}
	broker.Notifier = Notifications.NewNotificationsFacility(caliopenConfig, broker.NatsConn)
	broker.Connectors = TwitterBrokerConnectors{
		Egress: make(chan *DMpayload, 5),
	}
	return
}

func (broker *TwitterBroker) ShutDown() {
	for _, sub := range broker.natsSubscriptions {
		sub.Unsubscribe()
	}
	broker.NatsConn.Close()
	log.WithField("TwitterBroker", "Nats subscriptions & connexion closed").Info()
	broker.Store.Close()
	log.WithField("TwitterBroker", "Store client closed").Info()
	broker.Index.Close()
	log.WithField("TwitterBroker", "Index client closed").Info()
}
