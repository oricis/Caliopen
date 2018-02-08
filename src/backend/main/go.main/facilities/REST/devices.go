/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	"github.com/CaliOpen/Caliopen/.cache/govendor/github.com/satori/go.uuid"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/bitly/go-simplejson"
	"strings"
	"time"
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
	//MarshalNested(device) // no nested for now.
	MarshalRelated(device)

	if !strings.Contains(DeviceTypes, device.Type) {
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
func (rest *RESTfacility) PatchDevice(patch []byte, userId, deviceId string) error {
	current_device, e := rest.RetrieveDevice(userId, deviceId)
	if e != nil {
		if e.Error() == "not found" {
			return NewCaliopenErr(NotFoundCaliopenErr, "[RESTfacility] device not found")
		} else {
			return WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] PatchDevice failed to retrieve device")
		}
	}

	// read into the patch to make basic controls before processing it with generic helper
	patchReader, err := simplejson.NewJson(patch)
	if err != nil {
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[RESTfacility] PatchTag failed with simplejson error : %s", err)
	}
	// checks "current_state" property is present
	if _, hasCurrentState := patchReader.CheckGet("current_state"); !hasCurrentState {
		return NewCaliopenErr(ForbiddenCaliopenErr, "[RESTfacility] PatchTag : current_state property must be in patch")
	}

	// patch seams OK, apply it to the resource
	var modifiedFields map[string]interface{}
	newDevice, modifiedFields, err := helpers.UpdateWithPatch(patch, current_device, UserActor)
	if err != nil {
		return err
	}

	// save updated resource
	err = rest.UpdateDevice(newDevice.(*Device), current_device, modifiedFields)
	if err != nil {
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[RESTfacility] PatchContact failed with UpdateContact error : %s", err)
	}

	return nil
}

func (rest *RESTfacility) UpdateDevice(device, oldDevice *Device, modifiedFields map[string]interface{}) error {
	return rest.store.UpdateDevice(device, oldDevice, modifiedFields)
}

func (rest *RESTfacility) DeleteDevice(userId, deviceId string) error {
	device, e := rest.store.RetrieveDevice(userId, deviceId)
	if e != nil {
		if e.Error() == "not found" {
			return NewCaliopenErr(NotFoundCaliopenErr, "[RESTfacility] device not found")
		} else {
			return WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] DeleteDevice failed to retrieve device")
		}
	}

	return rest.store.DeleteDevice(device)
}
