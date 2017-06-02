// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
)



// part of LDABackend interface implementation
// return a list of users' ids found in user_name table for the given email addresses list
func (cb *CassandraBackend) GetUsersForRecipients(rcpts []string) (user_ids []obj.UUID, err error) {
	userTable := cb.IKeyspace.MapTable("local_identity", "identifier", &obj.LocalIdentity{})
	consistency := gocql.Consistency(cb.CassandraConfig.Consistency)

	// need to overwrite default gocassa naming convention that add `_map_name` to the mapTable name
	userTable = userTable.WithOptions(gocassa.Options{
		TableName:   "local_identity",
		Consistency: &consistency,
	})

	result := obj.UserName{}
	for _, rcpt := range rcpts {
		err = userTable.Read(rcpt, &result).Run()
		if err != nil {
			log.WithError(err).Infoln("error on userTable query")
			return
		}
		var uuid obj.UUID
		err := uuid.UnmarshalBinary(result.User_id)
		if err != nil {
			return []obj.UUID{}, err
		}
		user_ids = append(user_ids, uuid)
	}
	return
}
