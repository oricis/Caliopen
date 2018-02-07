/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// retrieve devices belonging to user_id
func (cb *CassandraBackend) RetrieveDevices(user_id string) (devices []Device, err error) {
	all_devices, err := cb.Session.Query(`SELECT * FROM device WHERE user_id = ?`, user_id).Iter().SliceMap()
	if err != nil {
		return
	}
	if len(all_devices) == 0 {
		err = errors.New("devices not found")
		return
	}
	for _, device := range all_devices {
		d := new(Device)
		d.UnmarshalCQLMap(device)
		devices = append(devices, *d)
	}
	return
}
