// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/REST"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
)

var (
	Facilities *CaliopenFacilities
)

type (
	CaliopenFacilities struct {
		config obj.CaliopenConfig

		RESTfacility REST.RESTservices

		// NATS facility
		nats *nats.Conn

		// LDA facility
		LDAstore backends.LDAStore
	}
)

func Initialize(config obj.CaliopenConfig) error {
	Facilities = new(CaliopenFacilities)
	return Facilities.initialize(config)
}

func (facilities *CaliopenFacilities) initialize(config obj.CaliopenConfig) (err error) {
	facilities.config = config
	//NATS facility initialization
	facilities.nats, err = nats.Connect(config.NatsConfig.Url)
	if err != nil {
		log.WithError(err).Warn("CaliopenFacilities : initalization of NATS connexion failed")
		return
	}

	//REST facility initialization
	facilities.RESTfacility = REST.NewRESTfacility(config, facilities.nats)

	return
}
