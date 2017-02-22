// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/satori/go.uuid"
	"gopkg.in/oleiade/reflections.v1"
	"time"
)

type RawMessageModel struct {
	Raw_msg_id []byte `cql:"raw_msg_id"`
	Data       string `cql:"data"`
}

type MessageModel struct {
	User_id                []byte           `cql:"user_id"             json:"user_id"               formatter:"rfc4122"`
	Message_id             []byte           `cql:"message_id"          json:"message_id"            formatter:"rfc4122"`
	Discussion_id          []byte           `cql:"thread_id"           json:"thread_id"             formatter:"rfc4122"`
	MsgType                string           `cql:"type"                json:"type"`
	From                   string           `cql:"from_"               json:"from"`
	Date                   time.Time        `cql:"date"                json:"date"                  formatter:"RFC3339Nano"`
	Date_insert            time.Time        `cql:"date_insert"         json:"date_insert"           formatter:"RFC3339Nano"`
	Size                   int              `cql:"size"                json:"size"`
	Privacy_index          int              `cql:"privacy_index"       json:"privacy_index"`
	Importance_level       int              `cql:"importance_level"    json:"importance_level"`
	Subject                string           `cql:"subject"             json:"subject"`
	External_msg_id        string           `cql:"external_message_id" json:"external_message_id"`
	External_parent_id     string           `cql:"external_parent_id"  json:"external_parent_id"`
	External_discussion_id string           `cql:"external_thread_id"  json:"external_thread_id"`
	Raw_msg_id             []byte           `cql:"raw_msg_id"          json:"raw_msg_id"            formatter:"rfc4122"`
	Tags                   []string         `cql:"tags"                json:"tags"`
	Flags                  []string         `cql:"flags"               json:"flags"`
	Offset                 int              `cql:"offset"              json:"offset"`
	State                  string           `cql:"state"               json:"state"`
	Recipients             []RecipientModel `cql:"recipients"          json:"recipients"`
	Body                   string           `cql:"text"                json:"text"`
}

type RecipientModel struct {
	RecipientType string `cql:"type"        json:"recipient_type"`
	Protocol      string `cql:"protocol"    json:"protocol"`
	Address       string `cql:"address"     json:"address"`
	Contact_id    []byte `cql:"contact_id"  json:"contact_id"       formatter:"rfc4122"`
	Label         string `cql:"label"       json:"label"`
}

// bespoke implementation of the json.Marshaler interface
// outputs a JSON representation of an object
func customJSONMarshaler(obj interface{}) ([]byte, error) {
	var jsonBuf bytes.Buffer
	enc := json.NewEncoder(&jsonBuf)

	fields, err := reflections.Fields(obj)
	if err != nil {
		return jsonBuf.Bytes(), err
	}
	jsonBuf.WriteByte('{')
	for index, field := range fields {
		j_field, err := reflections.GetFieldTag(obj, field, "json")
		if err == nil && j_field != "" && j_field != "-" {
			jsonBuf.WriteString("\"" + j_field + "\":")
			field_value, err := reflections.GetField(obj, field)
			j_formatter, err := reflections.GetFieldTag(obj, field, "formatter")
			if err == nil {
				switch j_formatter {
				case "rfc4122":
					uuid, err := uuid.FromBytes(field_value.([]byte))
					if err == nil {
						jsonBuf.WriteString("\"" + uuid.String() + "\"")
					} else {
						jsonBuf.Write([]byte{'"', '"'})
					}
				case "RFC3339Nano":
					jsonBuf.WriteString("\"" + field_value.(time.Time).Format(time.RFC3339Nano) + "\"")
				default:
					enc.Encode(field_value)
				}
			} else {
				jsonBuf.Write([]byte{'"', '"'})
			}
			if index < len(fields)-1 {
				jsonBuf.WriteByte(',')
			}
		}
	}
	jsonBuf.WriteByte('}')

	return jsonBuf.Bytes(), nil
}

func (msg *MessageModel) MarshalJSON() ([]byte, error) {
	return customJSONMarshaler(msg)
}

func (rcpt *RecipientModel) MarshalJSON() ([]byte, error) {
	return customJSONMarshaler(rcpt)
}
