/*
 * // Copyleft (ɔ) 2017 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	"fmt"
	"github.com/CaliOpen/Caliopen/.cache/govendor/github.com/satori/go.uuid"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/pkg/errors"
	"strings"
	"sync"
	"time"
)

// CreateContact validates Contact before saving it to cassandra and ES
func (rest *RESTfacility) CreateContact(contact *Contact) (err error) {
	// add missing properties
	contact.ContactId.UnmarshalBinary(uuid.NewV4().Bytes())
	contact.DateInsert = time.Now()
	contact.DateUpdate = contact.DateInsert

	// normalization
	helpers.ComputeTitle(contact)
	helpers.NormalizePhoneNumbers(contact)
	MarshalNested(contact)

	// concurrent creation in db & index
	wg := new(sync.WaitGroup)
	wg.Add(2)
	errGroup := new([]string)
	mx := new(sync.Mutex)
	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.store.CreateContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.index.CreateContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	wg.Wait()
	if len(*errGroup) > 0 {
		return fmt.Errorf("%s", strings.Join(*errGroup, " / "))
	}
	return nil

	//return rest.store.CreateContact(contact)
}

// RetrieveContacts returns contacts from index given filter params
func (rest *RESTfacility) RetrieveContacts(filter IndexSearch) (contacts []*Contact, totalFound int64, err error) {

	contacts, totalFound, err = rest.index.FilterContacts(filter)
	if err != nil {
		return []*Contact{}, 0, err
	}

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

// DeleteContact deletes a contact in store & index, only if :
// - contact belongs to user ;-)
// - contact is not the user's contact card
func (rest *RESTfacility) DeleteContact(userID, contactID string) error {
	user, err := rest.store.RetrieveUser(userID)
	if err != nil {
		return err
	}
	contact, err := rest.store.RetrieveContact(userID, contactID)
	if err != nil {
		return err
	}

	if user.ContactId == contact.ContactId {
		return errors.New("can't delete contact card related to user")
	}

	// parallel deletion in db & index
	wg := new(sync.WaitGroup)
	wg.Add(2)
	errGroup := new([]string)
	mx := new(sync.Mutex)
	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.store.DeleteContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.index.DeleteContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	wg.Wait()
	if len(*errGroup) > 0 {
		return fmt.Errorf("%s", strings.Join(*errGroup, " / "))
	}
	return nil
}
