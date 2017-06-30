// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// aggregate contact's identities with emails, phones, etc.
func (es *ElasticSearchBackend) ContactIdentities(user_id, contact_id string) (identities []ContactIdentity, err error) {

	//TODO
	identities = append(identities, ContactIdentity{
		Identifier: "dev@idoi.re",
		Label:      "Dave Idoire",
		Protocol:   "email",
	})
	return
}
