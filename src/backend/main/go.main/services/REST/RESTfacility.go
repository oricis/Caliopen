// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
)

type (
	RESTservices interface {
		UsernameIsAvailable(string) (bool, error)
		SendDraft(user_id, msg_id string) (msg *Message, err error)
		LocalsIdentities(user_id string) (identities []LocalIdentity, err error)
		SetMessageUnread(user_id, message_id string, status bool) error
		AddAttachment(user_id, message_id string, attachment []byte) (attachmentURL string, err error)
		DeleteAttachment(user_id, message_id string, attchmtIndex int) error
	}
	RESTfacility struct {
		store              backends.APIStorage
		index              backends.APIIndex
		nats_conn          *nats.Conn
		nats_outSMTP_topic string
	}
)

const nats_message_tmpl = "{\"order\":\"%s\", \"message_id\":\"%s\", \"user_id\":\"%s\"}"

func NewRESTfacility(config CaliopenConfig, nats_conn *nats.Conn) (rest_facility *RESTfacility) {
	rest_facility = new(RESTfacility)
	rest_facility.nats_conn = nats_conn
	rest_facility.nats_outSMTP_topic = config.NatsConfig.OutSMTP_topic
	switch config.RESTstoreConfig.BackendName {
	case "cassandra":
		cassaConfig := store.CassandraConfig{
			Hosts:       config.RESTstoreConfig.Hosts,
			Keyspace:    config.RESTstoreConfig.Keyspace,
			Consistency: gocql.Consistency(config.RESTstoreConfig.Consistency),
		}
		backend, err := store.InitializeCassandraBackend(cassaConfig)
		if err != nil {
			log.WithError(err).Fatalf("Initalization of %s backend failed", config.RESTstoreConfig.BackendName)
		}
		rest_facility.store = backends.APIStorage(backend) // type conversion
	default:
		log.Fatalf("Unknown backend: %s", config.RESTstoreConfig.BackendName)
	}

	switch config.RESTindexConfig.IndexName {
	case "elasticsearch":
		esConfig := index.ElasticSearchConfig{
			Urls: config.RESTindexConfig.Hosts,
		}
		index, err := index.InitializeElasticSearchIndex(esConfig)
		if err != nil {
			log.WithError(err).Fatalf("Initalization of %s index failed", config.RESTindexConfig.IndexName)
		}
		rest_facility.index = backends.APIIndex(index) // type conversion
	default:
		log.Fatalf("Unknown index: %s", config.RESTindexConfig.IndexName)
	}

	return rest_facility
}
