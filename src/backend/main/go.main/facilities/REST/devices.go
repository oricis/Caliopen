/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	"github.com/CaliOpen/Caliopen/.cache/govendor/github.com/satori/go.uuid"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
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

	if !strings.Contains(DeviceTypes, device.Type) {
		return NewCaliopenErrf(UnprocessableCaliopenErr, "[RESTfacility] CreateDevice : unknown type <%s> for new device", device.Type)
	}

	err := rest.store.CreateDevice(device)
	if err != nil {
		return WrapCaliopenErr(err, DbCaliopenErr, "[RESTfacility] CreateDevice failed to CreateDevice in store")
	}

	return nil
}
