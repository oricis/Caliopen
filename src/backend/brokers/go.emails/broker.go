// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package email_broker handles codec/decodec between external emails and Caliopen message format
package email_broker

import (
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/flashmob/go-guerrilla"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
)

type (
	emailBroker struct {
		Store      backends.LDAStore
		Index      backends.LDAIndex
		NatsConn   *nats.Conn
		Connectors EmailBrokerConnectors
		Config     LDAConfig
	}

	EmailBrokerConnectors struct {
		IncomingSmtp  chan *IncomingSmtpEmail
		OutcomingSmtp chan *OutcomingSmtpEmail
	}

	IncomingSmtpEmail struct {
		Email    *guerrilla.Envelope
		Response chan *DeliveryAck
	}

	OutcomingSmtpEmail struct {
		EmailMessage *EmailMessage
		Response     chan *DeliveryAck
	}

	natsOrder struct {
		Order     string `json:"order"`
		MessageId string `json:"message_id"`
		UserId    string `json:"user_id"`
	}

	DeliveryAck struct {
		EmailMessage *EmailMessage
		Err          error
		Response     string
	}
)

var (
	broker *emailBroker
)

func Initialize(conf LDAConfig) (connectors EmailBrokerConnectors, err error) {
	broker = &emailBroker{}
	broker.Config = conf
	switch conf.StoreName {
	case "cassandra":
		c := store.CassandraConfig{
			Hosts:       conf.StoreConfig.Hosts,
			Keyspace:    conf.StoreConfig.Keyspace,
			Consistency: gocql.Consistency(conf.StoreConfig.Consistency),
		}
		b, err := store.InitializeCassandraBackend(c)
		if err != nil {
			log.WithError(err).Warnf("EmailBroker : Initalization of %s backend failed", conf.StoreName)
			return connectors, err
		}

		broker.Store = backends.LDAStore(b) // type conversion to LDA interface
	case "BOBcassandra":
	// NotImplemented… yet ! ;-)
	default:
		log.Fatalf("Unknown store backend: %s", conf.StoreName)
	}

	switch conf.IndexName {
	case "elasticsearch":
		c := index.ElasticSearchConfig{
			Urls: conf.IndexConfig.Urls,
		}
		i, err := index.InitializeElasticSearchIndex(c)
		if err != nil {
			log.WithError(err).Warnf("Initalization of %s backend failed", conf.IndexName)
			return connectors, err
		}

		broker.Index = backends.LDAIndex(i) // type conversion to LDA interface
	}

	broker.NatsConn, err = nats.Connect(conf.NatsURL)
	if err != nil {
		log.WithError(err).Warn("Initalization of NATS connexion failed")
		return connectors, err
	}
	if conf.BrokerType == "smtp" {
		broker.Connectors.IncomingSmtp = make(chan *IncomingSmtpEmail)
		broker.Connectors.OutcomingSmtp = make(chan *OutcomingSmtpEmail)
		connectors = broker.Connectors

		broker.startIncomingSmtpAgent()

		broker.startOutcomingSmtpAgent()
	}

	return
}
