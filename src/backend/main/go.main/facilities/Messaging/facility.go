// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Messaging

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
)

type Facility interface {
	HandleUserAction(msg *nats.Msg)
}

type CaliopenMessaging struct {
	natsConn      *nats.Conn
	Subscriptions map[string]*nats.Subscription
}

func NewCaliopenMessaging(config CaliopenConfig, natsConn *nats.Conn) (Facility, error) {
	cm := new(CaliopenMessaging)
	cm.Subscriptions = map[string]*nats.Subscription{}
	cm.natsConn = natsConn
	userSub, err := cm.natsConn.Subscribe(config.NatsConfig.Users_topic, cm.HandleUserAction)
	if err != nil {

	}
	cm.Subscriptions[config.NatsConfig.Contacts_topic] = userSub
	return cm, nil
}

func (cm *CaliopenMessaging) HandleUserAction(msg *nats.Msg) {
	log.Infof("got a message on userAction topic : %+v", msg.Data)
}
