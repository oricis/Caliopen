// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
	"gopkg.in/oleiade/reflections.v1"
)

// CreateContact saves Contact to Cassandra
// AND fills/updates related lookup tables
func (cb *CassandraBackend) CreateContact(contact *Contact) error {
	contactT := cb.IKeyspace.Table("contact", &Contact{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "contact_id"},
	}).WithOptions(gocassa.Options{TableName: "contact"}) // need to overwrite default gocassa table naming convention

	err := contactT.Set(contact).Run()
	if err != nil {
		return fmt.Errorf("[CassandraBackend] CreateContact: %s", err)
	}
	isNew := true
	err = cb.UpdateRelated(contact, isNew)
	if err != nil {
		log.WithError(err).Error("[CassandraBackend] CreateContact : failed to UpdateRelated")
	}

	err = cb.UpdateLookups(contact, isNew)

	if err != nil {
		log.WithError(err).Error("[CassandraBackend] CreateContact : failed to UpdateLookups")
	}

	return nil
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

	err = cb.RetrieveRelated(contact)
	if err != nil {
		log.WithError(err).Error("[CassandraBackend] RetrieveContact: failed to retrieve related.")
	}
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

	isNew := false
	err = cb.UpdateRelated(contact, isNew)
	if err != nil {
		log.WithError(err).Error("[CassandraBackend] UpdateContact: failed to update related")
	}
	err = cb.UpdateLookups(contact, isNew)
	if err != nil {
		log.WithError(err).Error("[CassandraBackend] UpdateContact: failed to update lookups")
	}
	return err
}

// DeleteContact removes Contact from Cassandra
// AND removes contactID from related lookup_tables
func (cb *CassandraBackend) DeleteContact(contact *Contact) error {
	err := cb.Session.Query(`DELETE FROM contact WHERE user_id = ? AND contact_id = ?`, contact.UserId.String(), contact.ContactId.String()).Exec()
	if err != nil {
		return err
	}

	err = cb.DeleteRelated(contact)
	if err != nil {
		log.WithError(err).Error("[CassandraBackend] DeleteContact: failed to delete related")
	}
	err = cb.DeleteLookups(contact)
	if err != nil {
		log.WithError(err).Error("[CassandraBackend] DeleteContact: failed to delete lookups")
	}

	return nil
}

func (cb *CassandraBackend) LookupContactsByIdentifier(user_id, address string) (contact_ids []string, err error) {
	err = cb.Session.Query(`SELECT contact_ids FROM contact_lookup WHERE user_id=? and value=? and type='email'`, user_id, address).Scan(&contact_ids)
	return
}
