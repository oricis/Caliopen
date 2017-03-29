// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
	"github.com/pkg/errors"
	"github.com/relops/cqlr"
)

func (cb *CassandraBackend) GetMessage(user_id, msg_id string) (msg *obj.Message, err error) {

	msg = &obj.Message{}
	q := cb.Session.Query(`SELECT * FROM message WHERE user_id = ? and message_id = ?`, user_id, msg_id)
	b := cqlr.BindQuery(q)
	ok := b.Scan(msg)
	if !ok {
		return nil, errors.New("message not found")
	}
	return msg, nil

}

func (cb *CassandraBackend) UpdateMessage(msg *obj.Message, fields map[string]interface{}) error {

	messageT := cb.IKeyspace.Table("message", &obj.Message{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "message_id"},
	}).WithOptions(gocassa.Options{TableName: "message"}) // need to overwrite default gocassa table naming convention

	err := messageT.
		Where(gocassa.Eq("user_id", msg.User_id.String()), gocassa.Eq("message_id", msg.Message_id.String())).
		Update(fields).
		Run()
	return err
}

func (cb *CassandraBackend) StoreMessage(msg *obj.Message) error {

	messageT := cb.IKeyspace.Table("message", &obj.Message{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "message_id"},
	}).WithOptions(gocassa.Options{TableName: "message"}) // need to overwrite default gocassa table naming convention

	err := messageT.Set(msg).Run()
	if err != nil {
		return err
	}

	rawLookupT := cb.IKeyspace.Table("user_raw_lookup", &obj.Message{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "raw_msg_id"},
	}).WithOptions(gocassa.Options{TableName: "user_raw_lookup"}) // need to overwrite default gocassa table naming convention

	err = rawLookupT.Set(struct {
		User_id    string
		Raw_msg_id string
	}{msg.User_id.String(), msg.Raw_msg_id.String()}).Run()
	return err
}
