// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	"context"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	pi "github.com/CaliOpen/Caliopen/src/backend/main/go.main/Privacy-Index"
	"github.com/satori/go.uuid"
)

func (rest *RESTfacility) LocalsIdentities(user_id string) ([]LocalIdentity, error) {
	return rest.store.GetLocalsIdentities(user_id)
}

// get contact's identities from index, then update PI for each
func (rest *RESTfacility) ContactIdentities(user_id, contact_id string) (identities []ContactIdentity, err error) {
	_, e := uuid.FromString(contact_id)
	if user_id != "" && contact_id != "" && e == nil {
		identities, err = rest.index.ContactIdentities(user_id, contact_id)
		if err != nil {
			return []ContactIdentity{}, err
		}

		contact, err := rest.store.GetContact(user_id, contact_id)
		if err != nil {
			err = errors.New("[RESTfacility.ContactIdentities] error when retrieving contact : " + err.Error())
			return []ContactIdentity{}, err
		}

		for i := range identities {
			// (for now, this func is a monkey)
			pi.UpdatePIContactIdentity(context.TODO(), contact, &identities[i])
		}
	} else {
		err = errors.New("[RESTfacility.ContactIdentities] unprocessable parameters")
		return
	}
	return
}
