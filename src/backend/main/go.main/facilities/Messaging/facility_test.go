// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Messaging

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/NATS/go.mockednats"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/backendstest"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/Notifications"
	"github.com/nats-io/go-nats"
	"testing"
)

func TestNewCaliopenMessaging(t *testing.T) {
	// test errors returns
	facility, err := NewCaliopenMessaging(CaliopenConfig{}, nil)
	if facility != nil {
		t.Errorf("expected a nil facility, got %+v", facility)
	}
	if err == nil {
		t.Error("NewCaliopenMessaging should return an error, got nil")
	}
	facility, err = NewCaliopenMessaging(CaliopenConfig{}, &Notifications.Notifier{})
	if facility != nil {
		t.Errorf("expected a nil facility, got %+v", facility)
	}
	if err == nil {
		t.Error("initializing caliopen messaging with empty notifier should return an error, got nil")
	}

	natsServer, natsConn, err := mockednats.GetNats()
	defer natsServer.Shutdown()

	facility, err = NewCaliopenMessaging(CaliopenConfig{}, &Notifications.Notifier{
		NatsQueue: natsConn,
	})
	if err == nil {
		t.Error("initializing caliopen messaging with empty configuration should return error, got nil")
	}

	// test correct initialization
	notifier := &Notifications.Notifier{NatsQueue: natsConn}
	facility, err = NewCaliopenMessaging(CaliopenConfig{NatsConfig: NatsConfig{Users_topic: "userAction"}}, notifier)
	if err != nil {
		t.Error(err)
	}
	if f, ok := facility.(*CaliopenMessaging); ok {
		if len(f.Subscriptions) != 1 {
			t.Errorf("expected a facility with one nats subscription, got %d", len(f.Subscriptions))
		} else if s, ok := f.Subscriptions["userAction"]; ok {
			if !s.IsValid() {
				t.Error("expected a valid subscription at Subscriptions[\"UserAction\"], got invalid")
			}
		} else {
			t.Error("expected to have a entry in CaliopenMessaging's Subscriptions at key `userAction`, got nothing")
		}
		if f.caliopenNotifier != notifier {
			t.Errorf("expected to have a CaliopenMessaging with the notifier passed in constructor (%p), got %p", &f.caliopenNotifier, &notifier)
		}
	} else {
		t.Errorf("expected NewCaliopenMessagin to return a *CaliopenMessaging struct, got %T", f)
	}

	// last error checking
	natsConn.Close()
	facility, err = NewCaliopenMessaging(CaliopenConfig{}, &Notifications.Notifier{
		NatsQueue: natsConn, // passing closed connexion on purpose
	})
	if err == nil {
		t.Error("initializing caliopen messaging with empty nats connexion should return an error, got nil")
	}

}

func TestCaliopenMessaging_HandleUserAction(t *testing.T) {
	natsServer, natsConn, err := mockednats.GetNats()
	defer natsServer.Shutdown()
	store, _ := backendstest.GetNotificationsBackends()
	notifier := &Notifications.Notifier{
		NatsQueue: natsConn,
		Store:     store,
	}
	facility, err := NewCaliopenMessaging(CaliopenConfig{NatsConfig: NatsConfig{Users_topic: "userAction"}}, notifier)
	if err != nil {
		t.Error(err)
	}

	// overring notifyByEmail func
	// because this test checks if the func is correctly called within HandleUserAction, nothing more
	var notifCalled bool
	notifyByEmail = func(notifier *Notifications.Notifier, notif *Notification) CaliopenError {
		notifCalled = true
		return nil
	}

	// test errors handling
	// invalid nats msg
	facility.HandleUserAction(&nats.Msg{})
	if notifCalled {
		t.Error("expected that calling HandleUserAction with an empty nats message will not trigger notifyByEmail, but func was called")
		notifCalled = false
	}
	// unknown username
	facility.HandleUserAction(&nats.Msg{
		Subject: "test",
		Reply:   "test_reply",
		Data:    []byte(`{"message":"created", "user_name": "unknown", "user_id": "7f8329c4-e220-45fc-89b2-d8535df69e83"}`), // invalid user
	})
	if notifCalled {
		t.Error("expected that calling HandleUserAction with unknown username will not trigger notifyByEmail, but func was called")
		notifCalled = false
	}
	// unknown message
	facility.HandleUserAction(&nats.Msg{
		Subject: "test",
		Reply:   "test_reply",
		Data:    []byte(`{"message":"unknown", "user_name": "emma", "user_id": "7f8329c4-e220-45fc-89b2-d8535df69e83"}`), // invalid user
	})
	if notifCalled {
		t.Error("expected that calling HandleUserAction with unknown username will not trigger notifyByEmail, but func was called")
		notifCalled = false
	}
	// test valid payload
	facility.HandleUserAction(&nats.Msg{
		Subject: "test",
		Reply:   "test_reply",
		Data:    []byte(`{"message":"created", "user_name": "emma", "user_id": "7f8329c4-e220-45fc-89b2-d8535df69e83"}`),
	})
	if !notifCalled {
		t.Error("expected HandleUserAction to call notifyByEmail, but func was not called")
	}
}
