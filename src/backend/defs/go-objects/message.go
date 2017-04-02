// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/gocql/gocql"
	"gopkg.in/oleiade/reflections.v1"
	"time"
)

const (
	EmailProtocol string = "email"
)

type Message struct {
	Attachments         []Attachment       `cql:"attachments"              json:"attachments"       `
	Body                string             `cql:"body"                     json:"body"             `
	Date                time.Time          `cql:"date"                     json:"date"                                         formatter:"RFC3339Nano"`
	Date_delete         time.Time          `cql:"date_delete"              json:"date_delete"                                  formatter:"RFC3339Nano"`
	Date_insert         time.Time          `cql:"date_insert"              json:"date_insert"                                  formatter:"RFC3339Nano"`
	Discussion_id       UUID               `cql:"discussion_id"            json:"discussion_id"                                formatter:"rfc4122"`
	External_references ExternalReferences `cql:"external_references"      json:"external_references"   `
	Identities          []Identity         `cql:"identities"               json:"identities"       `
	Importance_level    int32              `cql:"importance_level"         json:"importance_level"`
	Is_answered         bool               `cql:"is_answered"              json:"is_answered"      `
	Is_draft            bool               `cql:"is_draft"                 json:"is_draft"         `
	Is_unread           bool               `cql:"is_unread"                json:"is_unread"        `
	Message_id          UUID               `cql:"message_id"               json:"message_id"                                   formatter:"rfc4122"`
	Parent_id           string             `cql:"parent_id"                json:"parent_id"        `
	Participants        []Participant      `cql:"participants"             json:"participants"     `
	Privacy_features    PrivacyFeatures    `cql:"privacy_features"         json:"privacy_features" `
	Raw_msg_id          UUID               `cql:"raw_msg_id"               json:"raw_msg_id"                                   formatter:"rfc4122"`
	Subject             string             `cql:"subject"                  json:"subject"          `
	Tags                []Tag              `cql:"tags"                     json:"tags"             `
	Type                string             `cql:"type"                     json:"type"             `
	User_id             UUID               `cql:"user_id"                  json:"user_id"                  elastic:"omit"      formatter:"rfc4122"`
}

// bespoke implementation of the json.Marshaler interface
// outputs a JSON representation of an object
// this marshaler takes account of custom tags for given 'context'
func customJSONMarshaler(obj interface{}, context string) ([]byte, error) {
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
			if context == "elastic" {
				j_elastic, err := reflections.GetFieldTag(obj, field, "elastic")
				if err == nil {
					switch j_elastic {
					case "omit":
						continue
					}
				}
			}
			jsonBuf.WriteString("\"" + j_field + "\":")
			field_value, err := reflections.GetField(obj, field)
			j_formatter, err := reflections.GetFieldTag(obj, field, "formatter")

			if err == nil {
				switch j_formatter {
				case "rfc4122":
					enc.Encode(field_value)
				case "RFC3339Nano":
					jsonBuf.WriteString("\"" + field_value.(time.Time).Format(time.RFC3339Nano) + "\"")
				default:
					enc.Encode(field_value)
				}
			} else {
				jsonBuf.Write([]byte{'"', '"'})
			}
			if index < (len(fields) - 1) {
				jsonBuf.WriteByte(',')
			}
		}
	}
	jsonBuf.WriteByte('}')
	return jsonBuf.Bytes(), nil
}

func (msg *Message) MarshalJSON() ([]byte, error) {
	return customJSONMarshaler(msg, "json")
}

func (msg *Message) MarshalES() ([]byte, error) {
	return customJSONMarshaler(msg, "elastic")
}

// unmarshal a map[string]interface{} that must owns all Message fields
func (msg *Message) UnmarshalMap(input map[string]interface{}) {
	//TODO: attachments
	msg.Body, _ = input["body"].(string)
	msg.Date, _ = input["date"].(time.Time)
	msg.Date_delete, _ = input["date_delete"].(time.Time)
	msg.Date_insert, _ = input["date_insert"].(time.Time)
	msg.Discussion_id.UnmarshalBinary(input["discussion_id"].(gocql.UUID).Bytes())

	ex_ref, _ := input["external_references"].(map[string]interface{})
	msg.External_references = ExternalReferences{}
	msg.External_references.Discussion_id, _ = ex_ref["discussion_id"].(string)
	msg.External_references.Message_id, _ = ex_ref["message_id"].(string)
	msg.External_references.Parent_id, _ = ex_ref["parent_id"].(string)
	msg.External_references.References, _ = ex_ref["references"].([]string)

	//TODO: Identities
	msg.Importance_level = int32(input["importance_level"].(int))
	msg.Is_answered, _ = input["is_answered"].(bool)
	msg.Is_draft, _ = input["is_draft"].(bool)
	msg.Is_unread, _ = input["is_unread"].(bool)
	msg.Message_id.UnmarshalBinary(input["message_id"].(gocql.UUID).Bytes())
	msg.Parent_id, _ = input["parent_id"].(string)
	msg.Participants = []Participant{}
	for _, participant := range input["participants"].([]map[string]interface{}) {
		p := Participant{}
		p.Address, _ = participant["address"].(string)
		//TODO: contact_ids
		p.Label, _ = participant["labebl"].(string)
		p.Protocol, _ = participant["protocol"].(string)
		p.Type, _ = participant["type"].(string)
		msg.Participants = append(msg.Participants, p)
	}
	//TODO: privacy_features
	msg.Raw_msg_id.UnmarshalBinary(input["raw_msg_id"].(gocql.UUID).Bytes())
	msg.Subject, _ = input["subject"].(string)
	//TODO: tags
	msg.Type, _ = input["type"].(string)
	msg.User_id.UnmarshalBinary(input["user_id"].(gocql.UUID).Bytes())
}
