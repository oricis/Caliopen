/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocql/gocql"

	"fmt"
	"github.com/gocassa/gocassa"
)

func (cb *CassandraBackend) GetLocalsIdentities(user_id string) (identities []LocalIdentity, err error) {
	user_identities := make(map[string]interface{})
	err = cb.Session.Query(`SELECT local_identities from user where user_id = ?`, user_id).MapScan(user_identities)
	if err != nil {
		return
	}
	if user_identities["local_identities"] == nil {
		err = errors.New("[cassandra] : local identities lookup returns empty")
		return
	}
	for _, identifier := range user_identities["local_identities"].([]string) {
		i := make(map[string]interface{})
		cb.Session.Query(`SELECT * FROM local_identity where identifier = ?`, identifier).MapScan(i)
		identity := LocalIdentity{
			Display_name: i["display_name"].(string),
			Identifier:   i["identifier"].(string),
			Status:       i["status"].(string),
			Type:         i["type"].(string),
		}
		identity.User_id.UnmarshalBinary(i["user_id"].(gocql.UUID).Bytes())
		identities = append(identities, identity)
	}

	return
}

func (cb *CassandraBackend) CreateRemoteIdentity(rId *RemoteIdentity) error {

	ridT := cb.IKeyspace.Table("remote_identity", &RemoteIdentity{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "identifier"},
	}).WithOptions(gocassa.Options{TableName: "remote_identity"})

	//save remote identity
	err := ridT.Set(rId).Run()
	if err != nil {
		return fmt.Errorf("[CassandraBackend] CreateRemoteIdentity: %s", err)
	}

	return nil
}
