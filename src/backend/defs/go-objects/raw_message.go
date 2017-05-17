// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type RawMessage struct {
	Json_rep   string `cql:"json_rep"          json:"json_rep"` //json representation of the raw message with its envelope
	Raw_msg_id UUID   `cql:"raw_msg_id"        json:"raw_msg_id"`
	Raw_data   string `cql:"raw_data"          json:"raw_data"` //could be empty if raw message is too large to be stored in db
	Raw_Size   uint64 `cql:"raw_size"          json:"raw_size"`
	URI        string `cql:"uri"               json:"uri"` //object's location if message is too large to be stored in db
}
