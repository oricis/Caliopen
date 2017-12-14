// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"gopkg.in/oleiade/reflections.v1"
	"time"
)

// "patch" tag indicates that the property could be modified by the specified actor.
// for example :
// If the "patch" tag is missing or not set to "user", property cannot be modified directly by an "UserInitiator" with a call to a PATCH method.
type Tag struct {
	// compound index
	User_id UUID   `cql:"user_id" json:"user_id" formatter:"rfc4122"` // primary key
	Name    string `cql:"name" json:"name"`                           // primary key
	// values
	Date_insert      time.Time `cql:"date_insert" json:"date_insert" formatter:"RFC3339Milli"`
	Importance_level int32     `cql:"importance_level" json:"importance_level" patch:"user"`
	Label            string    `cql:"label" json:"label" patch:"user"`
	Type             TagType   `cql:"type" json:"type"`
}

type TagType string

const (
	UserTag   TagType = "user"
	SystemTag TagType = "system"
)

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaler takes account of custom tags
func (tag Tag) MarshalJSON() ([]byte, error) {
	var jsonBuf bytes.Buffer
	enc := json.NewEncoder(&jsonBuf)

	fields, err := reflections.Fields(tag)
	if err != nil {
		return jsonBuf.Bytes(), err
	}
	jsonBuf.WriteByte('{')
	first := true
	for _, field := range fields {
		j_field, err := reflections.GetFieldTag(tag, field, "json")
		if err != nil {
			log.WithError(err).Warnf("reflection for field %s failed", field)
		} else {
			if j_field != "" && j_field != "-" {
				if first {
					first = false
				} else {
					jsonBuf.WriteByte(',')
				}
				jsonBuf.WriteString("\"" + j_field + "\":")
				field_value, err := reflections.GetField(tag, field)
				j_formatter, err := reflections.GetFieldTag(tag, field, "formatter")
				if err == nil {
					switch j_formatter {
					case "RFC3339Milli":
						jsonBuf.WriteString("\"" + field_value.(time.Time).Format(RFC3339Milli) + "\"")
					default:
						enc.Encode(field_value)
					}
				} else {
					jsonBuf.Write([]byte{'"', '"'})
				}
			} else {
				log.Warnf("Invalid field %s value: %s", field, j_field)
			}
		}
	}
	jsonBuf.WriteByte('}')
	return jsonBuf.Bytes(), nil
}

// UnmarshalMap is used when unmarshalling a JSON to a Tag
// it knows how to convert from json types to our custom types or nested struct.
// it lazily ignores missing fields, or unknown fields found in input map.
func (tag *Tag) UnmarshalMap(input map[string]interface{}) error {
	if date, ok := input["date_insert"]; ok {
		tag.Date_insert, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if il, ok := input["importance_level"].(float64); ok {
		tag.Importance_level = int32(il)
	}

	if label, ok := input["label"].(string); ok {
		tag.Label = label
	}

	if name, ok := input["name"].(string); ok {
		tag.Name = name
	}

	if tt, ok := input["type"].(string); ok {
		tag.Type = TagType(tt)
	}
	if id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(id); err == nil {
			tag.User_id.UnmarshalBinary(id.Bytes())
		}
	}
	return nil //TODO: errors handling
}

// unmarshal a map[string]interface{} that must owns all Tag's fields
// typical usage is for unmarshaling response from Cassandra backend
func (tag *Tag) UnmarshalCQLMap(input map[string]interface{}) error {
	tag.Date_insert = input["date_insert"].(time.Time)
	tag.Importance_level = int32(input["importance_level"].(int))
	tag.Label = input["label"].(string)
	tag.Name = input["name"].(string)
	tag.Type = TagType(input["type"].(string))
	userID, _ := input["user_id"].(gocql.UUID)
	tag.User_id.UnmarshalBinary(userID.Bytes())
	return nil
}

func (tag *Tag) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}
	return tag.UnmarshalMap(input)
}

// implementation of the CaliopenObject interface
func (tag *Tag) JsonTags() (tags map[string]string) {
	return jsonTags(tag)
}

func (tag *Tag) NewEmpty() interface{} {
	return new(Tag)
}
