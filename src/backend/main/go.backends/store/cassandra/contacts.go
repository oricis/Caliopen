// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

//******for testing purpose*******

package store

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
	"gopkg.in/oleiade/reflections.v1"
)

// CreateContact saves Contact to Cassandra
// AND fills related lookup tables
func (cb *CassandraBackend) CreateContact(contact *Contact) error {
	return errors.New("[CassandraBackend] not implemented")
}

func (cb *CassandraBackend) RetrieveContact(user_id, contact_id string) (contact *Contact, err error) {
	contact = new(Contact).NewEmpty().(*Contact)
	m := map[string]interface{}{}
	q := cb.Session.Query(`SELECT * FROM contact WHERE user_id = ? AND contact_id = ?`, user_id, contact_id)
	err = q.MapScan(m)
	if err != nil {
		return nil, err
	}
	contact.UnmarshalCQLMap(m)
	// retrieve public keys for this contact and
	// add keys to contact object.
	var keys []map[string]interface{}
	keys, err = cb.Session.Query(`SELECT * FROM public_key WHERE user_id = ? AND contact_id = ?`, user_id, contact_id).Iter().SliceMap()
	for _, key := range keys {
		pk := &PublicKey{}
		pk.UnmarshalCQLMap(key)
		contact.PublicKeys = append(contact.PublicKeys, *pk)
	}

	return contact, err
}

// UpdateContact updates fields into Cassandra
// AND updates related lookup tables if needed
func (cb *CassandraBackend) UpdateContact(contact *Contact, fields map[string]interface{}) error {

	//get cassandra's field name for each field to modify
	cassaFields := map[string]interface{}{}
	for field, value := range fields {
		cassaField, err := reflections.GetFieldTag(contact, field, "cql")
		if err != nil {
			return fmt.Errorf("[CassandraBackend] UpdateContact failed to find a cql field for object field %s", field)
		}
		cassaFields[cassaField] = value
	}

	contactT := cb.IKeyspace.Table("contact", &Contact{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "contact_id"},
	}).WithOptions(gocassa.Options{TableName: "contact"}) // need to overwrite default gocassa table naming convention

	err := contactT.
		Where(gocassa.Eq("user_id", contact.UserId.String()), gocassa.Eq("contact_id", contact.ContactId.String())).
		Update(cassaFields).
		Run()

	// TODO : update related
	return err
}

// DeleteContact removes Contact from Cassandra
// AND removes contactID from related lookup_tables
func (cb *CassandraBackend) DeleteContact(contact *Contact) error {
	err := cb.Session.Query(`DELETE FROM contact WHERE user_id = ? AND contact_id = ?`, contact.UserId.String(), contact.ContactId.String()).Exec()
	if err != nil {
		return err
	}

	// seek into contact_lookup to delete references to the deleted contact
	related, err := cb.Session.Query(`SELECT * from contact_lookup WHERE user_id = ?`, contact.UserId.String()).Iter().SliceMap()
	if err != nil {
		return err
	}
	for _, lookup := range related {
		ids := lookup["contact_ids"].([]gocql.UUID)
		updated_ids := []string{}
		for _, id := range ids {
			if id.String() != contact.ContactId.String() { // keep only contact_ids that are not from the deleted contact
				updated_ids = append(updated_ids, id.String())
			}
		}
		if len(ids) == 0 || // we found an empty lookup: it should have been removed ! cleaning up
			len(updated_ids) == 0 { // lookup had only one contact_ids and we just deleted it. cleaning up
			err := cb.Session.Query(`DELETE FROM contact_lookup WHERE user_id = ? AND value = ? AND type = ?`,
				lookup["user_id"],
				lookup["value"],
				lookup["type"]).Exec()
			if err != nil {
				return err
			}
		} else if len(ids) != len(updated_ids) { // an id has been pop, need to update contact_lookup
			err := cb.Session.Query(`UPDATE contact_lookup SET contact_ids = ? WHERE user_id = ? AND value = ? AND type = ?`,
				updated_ids,
				lookup["user_id"],
				lookup["value"],
				lookup["type"]).Exec()
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func (cb *CassandraBackend) LookupContactsByIdentifier(user_id, address string) (contact_ids []string, err error) {
	err = cb.Session.Query(`SELECT contact_ids FROM contact_lookup WHERE user_id=? and value=? and type='email'`, user_id, address).Scan(&contact_ids)
	return
}
