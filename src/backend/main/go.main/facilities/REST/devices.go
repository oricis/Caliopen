/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (rest *RESTfacility) RetrieveDevices(userId string) (devices []Device, err CaliopenError) {
	devices, e := rest.store.RetrieveDevices(userId)
	if e != nil {
		return devices, WrapCaliopenErr(e, DbCaliopenErr, "[RESTfacility] RetrieveDevices failed")
	}
	return devices, nil
}
