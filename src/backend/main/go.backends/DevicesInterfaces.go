/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type DevicesStorage interface {
	CreateDevice(device *Device) error
	RetrieveDevices(user_id string) (devices []Device, err error)
	RetrieveDevice(userId, deviceId string) (device *Device, err error)
	UpdateDevice(device, oldDevice *Device, modifiedFields map[string]interface{}) error
	DeleteDevice(device *Device) error
}
