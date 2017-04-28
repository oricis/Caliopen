// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.
//
// UserStorage interface implementation for cassandra backend

package store

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocql/gocql"
)

func (cb *CassandraBackend) Get(*obj.User) error {
	return nil
}

func (cb *CassandraBackend) GetLocalsIdentities(user_id string) (identities []obj.LocalIdentity, err error) {
	iter := cb.Session.Query(`SELECT * FROM local_identity where user_id = ?`, user_id).Iter()
	m := map[string]interface{}{}
	for iter.MapScan(m) {
		identity := obj.LocalIdentity{
			Display_name: m["display_name"].(string),
			Identifier:   m["identifier"].(string),
			Status:       m["status"].(string),
			Type:         m["type"].(string),
		}
		identity.User_id.UnmarshalBinary(m["user_id"].(gocql.UUID).Bytes())
		identities = append(identities, identity)
	}
	return
}
