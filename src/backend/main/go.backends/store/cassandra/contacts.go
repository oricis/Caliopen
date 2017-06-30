// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

//******for testing purpose*******

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (cb *CassandraBackend) GetContact(user_id, contact_id string) (contact Contact, err error) {

	/*
		err = cb.Session.Query(`SELECT user_id, contact_id, date_insert, family_name, given_name FROM contact WHERE user_id = ? and contact_id = ?`, user_id, contact_id).Scan(
			contact.User_id, contact.Contact_id, contact.Date_insert, contact.Family_name, contact.Given_name,
		)
		if err != nil {
			return nil, err
		}
	*/
	// TODO

	return
}

func (cb *CassandraBackend) LookupContactsByIdentifier(user_id, address string) (contact_ids []string, err error) {
	err = cb.Session.Query(`SELECT contact_ids FROM contact_lookup WHERE user_id=? and value=? and type='email'`, user_id, address).Scan(&contact_ids)
	return
}
