/*
 * // Copyleft (ɔ) 2017 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/pkg/errors"
)

func (rest *RESTfacility) CreateContact(contact *Contact) error {
	return errors.New("[RESTfacility] CreateContact not implemented")
	//return rest.store.CreateContact(contact)
}

func (rest *RESTfacility) RetrieveContacts(userID string) (contacts []Contact, err error) {
	err = errors.New("[RESTfacility] RetrieveContacts not implemented")
	return
}

func (rest *RESTfacility) RetrieveContact(userID, contactID string) (contact *Contact, err error) {
	return rest.store.RetrieveContact(userID, contactID)
}

// PatchContact is a shortcut for REST api to :
// - retrieve the contact from db
// - UpdateWithPatch()
// - then UpdateContact() to save updated contact to stores & index if everything went good.
func (rest *RESTfacility) PatchContact(patch []byte, userID, contactID string) error {

	current_contact, err := rest.RetrieveContact(userID, contactID)
	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	err = helpers.UpdateWithPatch(current_contact, patch, UserActor)
	if err != nil {
		return err
	}

	return rest.UpdateContact(current_contact)

}

// UpdateContact updates a contact in store & index with payload,
func (rest *RESTfacility) UpdateContact(contact *Contact) error {
	return errors.New("[RESTfacility] UpdateContact not implemented")
	/*
		userID := contact.UserId.String()
		contactID := contact.ContactId.String()
		update := map[string]interface{}{
			"tags": obj.(*Contact).Tags,
		}
		err := rest.store.UpdateContact(obj.(*Contact), update)
		if err != nil {
			return err
		}

		err = rest.index.UpdateContact(obj.(*Contact), update)
		if err != nil {
			return err
		}*/
}

// DeleteContact deletes a contact in store & index,
// only if contact belongs to user.
func (rest *RESTfacility) DeleteContact(userID, contactID string) error {
	return errors.New("[RESTfacility] DeleteContact not implemented")
}
