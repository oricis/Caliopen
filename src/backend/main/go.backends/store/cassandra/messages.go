// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
)

func (cb *CassandraBackend) GetMessage(user_id, msg_id string) (msg *objects.MessageModel, err error) {

	var m objects.MessageModel
	messageT := cb.IKeyspace.Table("message", &objects.MessageModel{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "message_id"},
	}).WithOptions(gocassa.Options{TableName: "message"}) // need to overwrite default gocassa table naming convention

	err = messageT.
		Where(gocassa.Eq("user_id", user_id), gocassa.Eq("message_id", msg_id)).
		ReadOne(&m).
		Run()

	return &m, err
}

func (cb *CassandraBackend) UpdateMessage(msg *objects.MessageModel, fields map[string]interface{}) error {

	messageT := cb.IKeyspace.Table("message", &objects.MessageModel{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "message_id"},
	}).WithOptions(gocassa.Options{TableName: "message"}) // need to overwrite default gocassa table naming convention

	err := messageT.
		Where(gocassa.Eq("user_id", msg.User_id), gocassa.Eq("message_id", msg.Message_id)).
		Update(fields).
		Run()
	return err
}
