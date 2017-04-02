// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen

import (
	"fmt"
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
	"time"
)

type (
	RESTservices interface {
		UsernameIsAvailable(string) (bool, error)
		SendDraft(user_id, msg_id string) (msg *obj.Message, err error)
	}
	RESTfacility struct {
		store              backends.APIStorage
		index              backends.LDAIndex
		nats_conn          *nats.Conn
		nats_outSMTP_topic string
	}
)

const nats_message_tmpl = "{\"order\":\"%s\", \"message_id\":\"%s\", \"user_id\":\"%s\"}"

func newRESTfacility(config obj.CaliopenConfig, nats_conn *nats.Conn) (rest_facility *RESTfacility) {
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
		rest_facility.store = backends.APIStorage(backend)
	default:
		log.Fatalf("Unknown backend: %s", config.RESTstoreConfig.BackendName)
	}
	return rest_facility
}

func (rest *RESTfacility) UsernameIsAvailable(username string) (bool, error) {
	return rest.store.UsernameIsAvailable(username)
}

func (rest *RESTfacility) SendDraft(user_id, msg_id string) (msg *obj.Message, err error) {
	const nats_order = "deliver"
	natsMessage := fmt.Sprintf(nats_message_tmpl, nats_order, msg_id, user_id)
	reply, err := rest.nats_conn.Request(rest.nats_outSMTP_topic, []byte(natsMessage), 10*time.Second)
	if err != nil {
		if rest.nats_conn.LastError() != nil {
			//TODO
		}
		//TODO
	}

	log.Infof("nats reply : %s", reply)

	return rest.store.GetMessage(user_id, msg_id)
}
