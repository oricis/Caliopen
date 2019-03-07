// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Messaging

import (
	"encoding/json"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/Notifications"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"github.com/satori/go.uuid"
)

type Facility interface {
	HandleUserAction(msg *nats.Msg)
}

type CaliopenMessaging struct {
	caliopenNotifier *Notifications.Notifier
	natsConn         *nats.Conn
	Subscriptions    map[string]*nats.Subscription
}

func NewCaliopenMessaging(config CaliopenConfig, notifier *Notifications.Notifier) (Facility, error) {
	if notifier == nil {
		return nil, errors.New("[NewCaliopenMessaging] needs a non-nil notifier")
	}
	if notifier.NatsQueue == nil {
		return nil, errors.New("[NewCaliopenMessaging] needs a non-nil natsConn")
	}
	cm := new(CaliopenMessaging)
	cm.natsConn = notifier.NatsQueue
	cm.Subscriptions = map[string]*nats.Subscription{}
	userSub, err := cm.natsConn.Subscribe(config.NatsConfig.Users_topic, cm.HandleUserAction)
	if err != nil {
		log.WithError(err).Error("[NewCaliopenMessaging] failed to subscribe to %s topic on NATS", config.NatsConfig.Users_topic)
		return nil, err
	}
	cm.Subscriptions[config.NatsConfig.Contacts_topic] = userSub
	cm.caliopenNotifier = notifier
	return cm, nil
}

func (cm *CaliopenMessaging) HandleUserAction(msg *nats.Msg) {
	payload := new(struct {
		Message  string `json:"message"`
		UserName string `json:"user_name"`
		UserId   string `json:"user_id"`
	})
	err := json.Unmarshal(msg.Data, payload)
	if err != nil {
		log.WithError(err).Errorf("[HandleUserAction] failed to unmarshal this nats' payload : %+v", msg.Data)
		return
	}
	switch payload.Message {
	case "created":
		user, err := cm.caliopenNotifier.Store.UserByUsername(payload.UserName)

		notif := &Notification{
			Body: "ccLocalMailbox", // this body will set ccLocalMailbox to true when calling SendEmailAdminToUser
			InternalPayload: &Message{
				Body_plain: "welcome to caliopen",
				Body_html:  "welcome to caliopen",
				Subject:    "welcome to caliopen",
			},
			NotifId: UUID(uuid.NewV1()),
			Type:    NotifAdminMail,
			User:    user,
		}
		cErr := cm.caliopenNotifier.ByEmail(notif)
		if err != nil {
			log.WithError(cErr).Warnf("[HandleUserAction] ByEmail notification failed (code : %d, cause : %s)", cErr.Code(), cErr.Cause())
		}
	default:
		log.Errorf("[HandleUserAction] unhandled message : %s", payload.Message)
	}

}
