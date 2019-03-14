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

// unexported vars to help override funcs in tests
var (
	notifyByEmail = func(notifier *Notifications.Notifier, notif *Notification) CaliopenError {
		return notifier.ByEmail(notif)
	}
)

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
	if config.NatsConfig.Users_topic == "" {
		return nil, errors.New("[NewCaliopenMessaging] wont subscribe to empty topic")
	}
	userSub, err := cm.natsConn.Subscribe(config.NatsConfig.Users_topic, cm.HandleUserAction)
	if err != nil {
		log.WithError(err).Errorf("[NewCaliopenMessaging] failed to subscribe to %s topic on NATS", config.NatsConfig.Users_topic)
		return nil, err
	}
	cm.Subscriptions[config.NatsConfig.Users_topic] = userSub
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
		if err != nil {
			log.WithError(err).Errorf("[HandleUserAction] failed to retrieve user %s", payload.UserName)
			return
		}
		notif := &Notification{
			NotifId: UUID(uuid.NewV1()),
			Type:    OnboardingMails,
			User:    user,
		}
		cErr := notifyByEmail(cm.caliopenNotifier, notif)
		if cErr != nil {
			log.WithError(cErr).Warnf("[HandleUserAction] ByEmail notification failed (code : %d, cause : %s)", cErr.Code(), cErr.Cause())
		}
	default:
		log.Errorf("[HandleUserAction] unhandled message : %s", payload.Message)
	}

}
