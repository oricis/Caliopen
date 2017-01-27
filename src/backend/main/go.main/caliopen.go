// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen

import (
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
)

var (
	Facilities *CaliopenFacilities
)

type (
	CaliopenFacilities struct {
		config obj.CaliopenConfig

		RESTfacility *facility

		// NATS facility
		nats *nats.Conn

		// LDA facility
		LDAstore *backends.LDABackend
	}

        facility struct {
                store    *backends.APIStorage
                //RESTindex *backends.APIindex
        }

)

type RESTservices interface {
        UsernameIsAvailable (string) (bool, error)
}

func Initialize(config obj.CaliopenConfig) error {
	Facilities = new(CaliopenFacilities)
	return Facilities.initialize(config)
}

func (facilities *CaliopenFacilities) initialize(config obj.CaliopenConfig) error {
	facilities.config = config

	//REST facility initialization
        facilities.RESTfacility = new(facility)
	switch config.RESTstoreConfig.BackendName {
	case "cassandra":
		backend := &store.CassandraBackend{}
		cassaConfig := store.CassandraConfig{
			Hosts:       config.RESTstoreConfig.Hosts,
			Keyspace:    config.RESTstoreConfig.Keyspace,
			Consistency: gocql.Consistency(config.RESTstoreConfig.Consistency),
		}
		err := backend.Initialize(cassaConfig)
		if err != nil {
			log.WithError(err).Fatalf("Initalization of %s backend failed", config.RESTstoreConfig.BackendName)
		}
		b := backends.APIStorage(backend)
		facilities.RESTfacility.store = &b
	case "BOBcassandra":
	// NotImplemented… yet ! ;-)
	default:
		log.Fatalf("Unknown backend: %s", config.RESTstoreConfig.BackendName)
	}

	return nil
}
