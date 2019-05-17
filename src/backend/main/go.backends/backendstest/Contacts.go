// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type ContactsBackend struct {
	contacts map[string]*Contact
}

func GetContactBackend() ContactsBackend {
	return ContactsBackend{
		contacts: Contacts,
	}
}

func (cb ContactsBackend) CreateContact(contact *Contact) error {
	return errors.New("CreateContact test interface not implemented")
}
func (cb ContactsBackend) RetrieveContact(userID, contactID string) (contact *Contact, err error) {
	return nil, errors.New("RetrieveContact test interface not implemented")
}
func (cb ContactsBackend) RetrieveUserContactId(userID string) string {
	return ""
}
func (cb ContactsBackend) UpdateContact(contact, oldContact *Contact, fields map[string]interface{}) error {
	//return errors.New("UpdateContact test interface not implemented")
	return nil
}
func (cb ContactsBackend) DeleteContact(contact *Contact) error {
	return errors.New("DeleteContact test interface not implemented")
}
func (cb ContactsBackend) ContactExists(userId, contactId string) bool {
	return false
}

func (cb ContactsBackend) LookupContactsByIdentifier(user_id, address, kind string) ([]string, error) {
	if contact_id, ok := ContactLookup[kind+":"+address]; ok {
		return []string{contact_id}, nil
	} else {
		return nil, errors.New("not found")
	}
}

func (cb ContactsBackend) ContactsForParticipants(userID string, participants map[string]Participant) error {
	return errors.New("ContactForParticipants test interface not implemented")
}

// ContactIndex interface
type ContactsIndex struct {
}

func (ci ContactsIndex) CreateContact(user *UserInfo, contact *Contact) error {
	return errors.New("CreateContact test interface not implemented")
}

func (ci ContactsIndex) UpdateContact(user *UserInfo, contact *Contact, fields map[string]interface{}) error {
	//return errors.New("UpdateContact test interface not implemented")
	return nil
}

func (ci ContactsIndex) FilterContacts(search IndexSearch) (contacts []*Contact, totalFound int64, err error) {
	return nil, 0, errors.New("FilterContact test interface not implemented")
}

func (ci ContactsIndex) DeleteContact(user *UserInfo, contact *Contact) error {
	return errors.New("DeleteContact test interface not implemented")
}
