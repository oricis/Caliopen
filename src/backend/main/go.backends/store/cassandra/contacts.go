// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

//******for testing purpose*******

package store

import (
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
)

func (cb *CassandraBackend) GetContact(user_id, contact_id string) (contact *objects.ContactModel, err error) {

	var c objects.ContactModel
	err = cb.Session.Query(`SELECT user_id, contact_id, date_insert, family_name, given_name FROM contact WHERE user_id = ? and contact_id = ?`, user_id, contact_id).Scan(
		&c.User_id, &c.Contact_id, &c.Date_insert, &c.Family_name, &c.Given_name,
	)
	if err != nil {
		return nil, err
	}
	contact = &c
	return
}

func (cb *CassandraBackend) LookupContactsByIdentifier(user_id, address string) (contact_ids []string, err error) {
	err = cb.Session.Query(`SELECT contact_ids FROM contact_lookup WHERE user_id=? and value=? and type='email'`, user_id, address).Scan(&contact_ids)
	return
}
