// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type DevicesStore struct {
	devices map[string]*Device
}

func (ds DevicesStore) CreateDevice(device *Device) error {
	return errors.New("test interface not implemented")
}
func (ds DevicesStore) RetrieveDevices(user_id string) (devices []Device, err error) {
	return nil, errors.New("test interface not implemented")
}
func (ds DevicesStore) RetrieveDevice(userId, deviceId string) (device *Device, err error) {
	if device, ok := Devices[userId+deviceId]; ok {
		return device, nil
	}
	return nil, errors.New("not found")
}
func (ds DevicesStore) UpdateDevice(device, oldDevice *Device, modifiedFields map[string]interface{}) error {
	Devices[device.UserId.String()+device.DeviceId.String()] = device
	return nil
}
func (ds DevicesStore) DeleteDevice(device *Device) error {
	return errors.New("test interface not implemented")
}
