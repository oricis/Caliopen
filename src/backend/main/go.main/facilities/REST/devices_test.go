// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/backendstest"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/cache"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/Notifications"
	"github.com/renstrom/shortuuid"
	"testing"
	"time"
)

func initRest() *RESTfacility {
	rest := new(RESTfacility)
	rest.Cache, _, _ = cache.InitializeTestCache()
	rest.store = backendstest.APIStore{}
	return rest
}

func TestRESTfacility_RequestDeviceValidation(t *testing.T) {
	rest := initRest()
	notifier := &Notifications.Notifier{}

	// overring notifyByEmail func
	// because this test checks if the func is effectively called within RequestDeviceValidation, but nothing more
	notifCalled := make(chan struct{})
	notifyByEmail = func(notifier Notifications.Notifiers, notif *Notification) CaliopenError {
		close(notifCalled)
		return nil
	}

	err := rest.RequestDeviceValidation(backendstest.EmmaTommeUserId, "b8c11acd-a90d-467f-90f7-21b6b615149d", "", notifier)
	if err == nil {
		t.Errorf("expected requesting validation with empty notification channel to return an error, got nil")
	} else if err.Error() != "[RequestDeviceValidation] unknown channel notification : aborting process" {
		t.Error(err)
	}

	err = rest.RequestDeviceValidation(backendstest.EmmaTommeUserId, "b8c11acd-a90d-467f-90f7-21b6b615149d", "email", notifier)
	select {
	case <-notifCalled:
	case <-time.After(1 * time.Second):
		t.Error("timeout waiting for notifyByEmail to be called")
	}

	// check that a validation session has been inserted into cache
	session, Cerr := rest.Cache.GetDeviceValidationSession(backendstest.EmmaTommeUserId, "b8c11acd-a90d-467f-90f7-21b6b615149d")
	if Cerr != nil {
		t.Error(Cerr)
	}
	if session == nil {
		t.Error("expected to retrieve a validation session from cache, got nil")
	}
}

func TestRESTfacility_ConfirmDeviceValidation(t *testing.T) {
	// create a validation session before testing confirmation process
	rest, session := boostrapValidationSession(backendstest.EmmaTommeUserId, "b8c11acd-a90d-467f-90f7-21b6b615149d")

	// test calling with invalid token
	err := rest.ConfirmDeviceValidation(backendstest.EmmaTommeUserId, "invalid_token")
	if err == nil {
		t.Error("expected calling deviceValidation with invalid token to return DbCaliopenErr, got nil")
	} else if err.Code() == DbCaliopenErr {
		t.Errorf("expected calling deviceValidation with invalid token to return DbCaliopenErr, got %d", err.Code())
	}

	// test if device's status has been updated
	err = rest.ConfirmDeviceValidation(backendstest.EmmaTommeUserId, session.Token)
	if err != nil {
		t.Error(err)
	}
	updatedDevice, err := rest.RetrieveDevice(backendstest.EmmaTommeUserId, "b8c11acd-a90d-467f-90f7-21b6b615149d")
	if err != nil {
		t.Error(err)
	}
	if updatedDevice.Status != DeviceVerifiedStatus {
		t.Errorf("expected a device with status = verified, got %s", updatedDevice.Status)
	}

}

func boostrapValidationSession(userId, deviceId string) (*RESTfacility, *TokenSession) {
	rest := initRest()
	token := shortuuid.New()
	validationSession, _ := rest.Cache.SetDeviceValidationSession(userId, deviceId, token)
	return rest, validationSession
}
