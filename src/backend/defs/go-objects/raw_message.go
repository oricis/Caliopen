// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import "github.com/gocql/gocql"

type RawMessage struct {
	//Json_rep   string `cql:"json_rep"          json:"json_rep"` //json representation of the raw message with its envelope
	Raw_msg_id UUID   `cql:"raw_msg_id"        json:"raw_msg_id"`
	Raw_data   string `cql:"raw_data"          json:"raw_data"` //could be empty if raw message is too large to be stored in db
	Raw_Size   uint64 `cql:"raw_size"          json:"raw_size"`
	URI        string `cql:"uri"               json:"uri"` //object's location if message is too large to be stored in db
}

// unmarshal a map[string]interface{} that must owns all Message fields
func (msg *RawMessage) UnmarshalMap(input map[string]interface{}) {
	raw_msg_id, _ := input["raw_msg_id"].(gocql.UUID)
	msg.Raw_msg_id.UnmarshalBinary(raw_msg_id.Bytes())
	raw_data, _ := input["raw_data"].([]byte)
	msg.Raw_data = string(raw_data)
	size, _ := input["raw_size"].(int)
	msg.Raw_Size = uint64(size)
	msg.URI, _ = input["uri"].(string)
}
