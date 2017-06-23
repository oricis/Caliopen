// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (rest *RESTfacility) LocalsIdentities(user_id string) ([]LocalIdentity, error) {
	return rest.store.GetLocalsIdentities(user_id)
}
