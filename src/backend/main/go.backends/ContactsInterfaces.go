/*
 * // Copyleft (ɔ) 2017 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type ContactStorage interface {
	CreateContact(contact *Contact) error
	RetrieveContact(userID, contactID string) (contact *Contact, err error)
	RetrieveUserContactId(userID string) string
	UpdateContact(contact, oldContact *Contact, fields map[string]interface{}) error
	DeleteContact(contact *Contact) error
	ContactExists(userId, contactId string) bool
	LookupContactsByIdentifier(user_id, address, kind string) (contact_ids []string, err error)
}

type ContactIndex interface {
	CreateContact(user *UserInfo, contact *Contact) error
	DeleteContact(user *UserInfo, contact *Contact) error
	UpdateContact(user *UserInfo, contact *Contact, fields map[string]interface{}) error
	FilterContacts(search IndexSearch) (Contacts []*Contact, totalFound int64, err error)
}
