// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"errors"
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
)

// part of LDABackend interface
func (cb *CassandraBackend) StoreRawMessage(raw_message string) (uuid string, err error) {
	rawMsgTable := cb.IKeyspace.MapTable("raw_message", "raw_msg_id", &obj.RawMessage{})
	consistency := gocql.Consistency(cb.CassandraConfig.Consistency)

	// need to overwrite default gocassa naming convention that add `_map_name` to the mapTable name
	rawMsgTable = rawMsgTable.WithOptions(gocassa.Options{
		TableName:   "raw_message",
		Consistency: &consistency,
	})

	raw_uuid, err := gocql.RandomUUID()
	var msg_id obj.UUID
	msg_id.UnmarshalBinary(raw_uuid.Bytes())
	m := obj.RawMessage{
		Raw_msg_id: msg_id,
		Raw_Size:   uint64(len(raw_message)),
	}

	// handle emails too large to fit into cassandra
	if m.Raw_Size > cb.CassandraConfig.SizeLimit {
		if cb.CassandraConfig.WithObjStore {
			uri, err := cb.ObjectsStore.PutRawMessage(msg_id, raw_message)
			if err != nil {
				return "", err
			}
			m.URI = uri
			m.Raw_data = ""
		} else {
			return "", errors.New("Object too large to fit into cassandra")
		}
	} else {
		m.Raw_data = raw_message
		m.URI = ""
	}

	if err = rawMsgTable.Set(m).Run(); err != nil {
		return "", err
	}
	uuid = raw_uuid.String()
	return
}

func (cb *CassandraBackend) GetRawMessage(raw_message_id string) (message string, err error) {

	return
}
