/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/Notifications"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	log "github.com/Sirupsen/logrus"
	"github.com/bitly/go-simplejson"
	"github.com/renstrom/shortuuid"
	"github.com/satori/go.uuid"
	"gopkg.in/redis.v5"
	"strings"
	"time"
)

// unexported vars to help override funcs in tests
var (
	notifyByEmail = func(notifier Notifications.Notifiers, notif *Notification) CaliopenError {
		return notifier.ByEmail(notif)
	}
)

func (rest *RESTfacility) RetrieveDevices(userId string) (devices []Device, err CaliopenError) {
	devices, e := rest.store.RetrieveDevices(userId)
	if e != nil {
		return devices, WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] RetrieveDevices failed")
	}
	return devices, nil
}

func (rest *RESTfacility) CreateDevice(device *Device) CaliopenError {
	// add missing properties
	device.DeviceId.UnmarshalBinary(uuid.NewV4().Bytes())
	device.DateInsert = time.Now()
	if strings.TrimSpace(device.Type) == "" {
		device.Type = DefaultDeviceType()
	}
	/** MarshalNested(device) /** no nested for now. **/
	MarshalRelated(device)

	if !IsValidDeviceType(device.Type) {
		return NewCaliopenErrf(UnprocessableCaliopenErr, "[RESTfacility] CreateDevice : unknown type <%s> for new device", device.Type)
	}

	err := rest.store.CreateDevice(device)
	if err != nil {
		return WrapCaliopenErr(err, DbCaliopenErr, "[RESTfacility] CreateDevice failed to CreateDevice in store")
	}

	return nil
}

func (rest *RESTfacility) RetrieveDevice(userId, deviceId string) (device *Device, err CaliopenError) {

	device, e := rest.store.RetrieveDevice(userId, deviceId)

	if e != nil {
		return nil, WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] RetrieveDevice failed")
	}

	return device, nil
}

// PatchDevice is a shortcut for REST api to :
// - retrieve the device from db
// - UpdateWithPatch()
// - then UpdateDevice() to save updated device to store if everything went good.
func (rest *RESTfacility) PatchDevice(patch []byte, userId, deviceId string) CaliopenError {
	current_device, e := rest.RetrieveDevice(userId, deviceId)
	if e != nil {
		return e
	}

	// read into the patch to make basic controls before processing it with generic helper
	patchReader, err := simplejson.NewJson(patch)
	if err != nil {
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[RESTfacility] PatchTag failed with simplejson error : %s", err)
	}
	// check "current_state" property is present
	if _, hasCurrentState := patchReader.CheckGet("current_state"); !hasCurrentState {
		return NewCaliopenErr(ForbiddenCaliopenErr, "[RESTfacility] PatchTag : current_state property must be in patch")
	}

	// check device type consistency
	if deviceType, hasType := patchReader.CheckGet("type"); hasType {
		if !IsValidDeviceType(deviceType.MustString()) {
			return NewCaliopenErrf(UnprocessableCaliopenErr, "[RESTfacility] PatchDevice : unknown type <%s> for device", deviceType.MustString())
		}
	}

	// patch seams OK, apply it to the resource
	var modifiedFields map[string]interface{}
	newDevice, modifiedFields, err := helpers.UpdateWithPatch(patch, current_device, UserActor)
	if err != nil {
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[RESTfacility] PatchContact failed with UpdateContact error : %s", err)
	}

	// save updated resource
	e = rest.UpdateDevice(newDevice.(*Device), current_device, modifiedFields)
	if e != nil {
		return e
	}

	return nil
}

func (rest *RESTfacility) UpdateDevice(device, oldDevice *Device, modifiedFields map[string]interface{}) CaliopenError {
	err := rest.store.UpdateDevice(device, oldDevice, modifiedFields)
	if err != nil {
		return WrapCaliopenErr(err, DbCaliopenErr, "[RESTfacility] UpdateDevice failed to update device")
	}
	return nil
}

func (rest *RESTfacility) DeleteDevice(userId, deviceId string) CaliopenError {
	device, e := rest.store.RetrieveDevice(userId, deviceId)
	if e != nil {
		return WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] DeleteDevice failed to retrieve device")
	}

	e = rest.store.DeleteDevice(device)
	if e != nil {
		return WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] DeleteDevice failed to delete device")
	}

	return nil
}

// RequestDeviceValidation sets a temporary validation token in cache
// and sends it to user via Notifier facility on given channel
func (rest *RESTfacility) RequestDeviceValidation(userId, deviceId, channel string, notifier Notifications.Notifiers) CaliopenError {
	// 1. check if resources exist
	user, err := rest.store.RetrieveUser(userId)
	if err != nil || user == nil || !user.DateDelete.IsZero() {
		return NewCaliopenErr(NotFoundCaliopenErr, "user not found")
	}
	device, err := rest.store.RetrieveDevice(userId, deviceId)
	if err != nil || device == nil {
		return WrapCaliopenErr(err, NotFoundCaliopenErr, "device not found")
	}

	// 2. check if a validation request has already been ignited for these resources
	validationSession, err := rest.Cache.GetDeviceValidationSession(userId, deviceId)
	if err != nil && err != redis.Nil {
		log.WithError(err).Errorf("[RequestDeviceValidation] failed to GetDeviceValidationSession for user %s, device %s", userId, deviceId)
		return WrapCaliopenErrf(err, DbCaliopenErr, "failed to check  validation session in cache for user %s, device %s. Aborting", userId, deviceId)
	}
	if validationSession != nil {
		err = rest.Cache.DeleteDeviceValidationSession(userId, deviceId)
		if err != nil {
			log.WithError(err).Errorf("[RequestDeviceValidation] failed to delete previous validation session for user %s, device %s", userId, deviceId)
			return WrapCaliopenErrf(err, DbCaliopenErr, "failed to delete previous validation session in cache for user %s, device %s. Aborting", userId, deviceId)
		}
		log.Infof("[RequestDeviceValidation] device validation session delete for user <%s> and device <%s>", userId, deviceId)
	}

	// 3. generate a validation token and cache it
	token := shortuuid.New()
	validationSession, err = rest.Cache.SetDeviceValidationSession(userId, deviceId, token)
	if err != nil {
		log.WithError(err).Errorf("[RequestDeviceValidation] failed to store validation session in cache for user %s, device %s", userId, deviceId)
		return WrapCaliopenErr(err, DbCaliopenErr, "failed to store validation session in cache")
	}

	// 4. sends valilation token to user
	switch channel {
	case "email":
		notif := &Notification{
			User:            user,
			InternalPayload: validationSession,
			NotifId:         UUID(uuid.NewV1()),
			Body:            device.Name,
			Type:            NotifDeviceValidation,
		}
		go notifyByEmail(notifier, notif)
	default:
		log.Warnf("[RequestDeviceValidation] unknown channel notification : %s", channel)
		_ = rest.Cache.DeleteDeviceValidationSession(userId, deviceId)
		return NewCaliopenErrf(FailDependencyCaliopenErr, "[RequestDeviceValidation] unknown channel notification : aborting process")
	}

	return nil
}

func (rest *RESTfacility) ConfirmDeviceValidation(userId, token string) CaliopenError {

	session, err := rest.Cache.GetTokenValidationSession(userId, token)
	if err != nil && err != redis.Nil {
		return WrapCaliopenErrf(err, DbCaliopenErr, "[ConfirmDeviceValidation] failed to get session for user %s, token %s", userId, token)
	}
	if session == nil || err == redis.Nil {
		return NewCaliopenErr(NotFoundCaliopenErr, "not found")
	}

	// update device's state
	currentDevice, err := rest.RetrieveDevice(userId, session.ResourceId)
	if err != nil {
		log.WithError(err).Errorf("[ConfirmDeviceValidation] failed to retrieve device %s", session.ResourceId)
		return WrapCaliopenErrf(err, NotFoundCaliopenErr, "failed to retrieve device %s", session.ResourceId)
	}
	var newDevice Device
	newDevice = *currentDevice
	newDevice.Status = DeviceVerifiedStatus
	err = rest.UpdateDevice(&newDevice, currentDevice, map[string]interface{}{"Status": DeviceVerifiedStatus})
	if err != nil {
		log.WithError(err).Errorf("[ConfirmDeviceValidation] failed to update device %s", session.ResourceId)
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "failed to update device %s", session.ResourceId)
	}

	// invalidate validation token
	err = rest.Cache.DeleteDeviceValidationSession(userId, session.ResourceId)
	if err != nil {
		log.WithError(err).Errorf("[ConfirmDeviceValidation] failed to delete session for user %s, device %s", userId, session.ResourceId)
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "failed to delete session for user %s, device %s", userId, session.ResourceId)
	}

	return nil
}
