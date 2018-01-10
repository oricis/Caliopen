// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"gopkg.in/oleiade/reflections.v1"
	"time"
)

// this interface is mainly a collection of helpers to facilitate the job of reflection
type CaliopenObject interface {
	// JsonTags returns a map[string]string of the "json" tags found for each object property
	// map key is the tag value (json:"xxxx"), mapping to the corresponding struct property name
	JsonTags() map[string]string
	// NewInstance returns the pointer returned by the new() builtin applied to the underlying object
	NewEmpty() interface{}
	// UnmarshalJSON is json.Unmarshaller interface
	UnmarshalJSON(b []byte) error
}

// types below are helpers to manage embedded and related struct within storage
// as well as lookup tables.
type (
	// objects with embedded struct that must be stored alongside their parent.
	// these embedded struct must have an
	HasNested interface {
		GetSetNested() <-chan interface{}
	}

	// objects with joined objects stored in separate table
	HasRelated interface {
		GetRelatedList() map[string]interface{}
		GetSetRelated() <-chan interface{}
	}

	// objects with related tables that must be maintained up-to-date
	HasLookup interface {
		GetLookups() []StoreLookup
	}

	NewMarshaller interface {
		MarshallNew(...interface{}) // ensure mandatory properties are correctly set on new structs.
	}

	StoreLookup interface {
		CleanupLookups(...interface{}) func(session *gocql.Session) error //returns the func which cassandra backend must run to cleanup lookups table
	}
	// structs capable to return JSON representation suitable for frontend client
	FrontEndMarshaller interface {
		MarshalFrontEnd() ([]byte, error)
	}
)

// generic implementation of the jsonTags func (see above) for CaliopenObject interface
func jsonTags(obj interface{}) (tags map[string]string) {
	tags = make(map[string]string)
	fields, err := reflections.Fields(obj)
	if err != nil {
		return
	}
	for _, field := range fields {
		tag, err := reflections.GetFieldTag(obj, field, "json")
		if err == nil {
			tags[tag] = field
		}
	}
	return
}

// MarshalNested calls MarshalNew() on nested structs
func MarshalNested(obj HasNested) {
	for nested := range obj.GetSetNested() {
		if nest, ok := nested.(NewMarshaller); ok {
			nest.MarshallNew()
		}
	}
}

// MarshalNested calls MarshalNew() on related structs
func MarshalRelated(obj HasRelated) {
	for related := range obj.GetSetRelated() {
		if rel, ok := related.(NewMarshaller); ok {
			rel.MarshallNew(obj)
		}
	}
}

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaller takes account of custom tags for given 'context'
func JSONMarshaller(context string, obj interface{}) ([]byte, error) {
	var jsonBuf bytes.Buffer
	enc := json.NewEncoder(&jsonBuf)

	fields, err := reflections.Fields(obj)
	if err != nil {
		return jsonBuf.Bytes(), err
	}
	jsonBuf.WriteByte('{')
	first := true
fieldsLoop:
	for _, field := range fields {
		switch context {
		case "frontend":
			front, err := reflections.GetFieldTag(obj, field, "frontend")
			if err == nil {
				switch front {
				case "omit":
					continue fieldsLoop
				}
			}
		}
		j_field, err := reflections.GetFieldTag(obj, field, "json")
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
				field_value, err := reflections.GetField(obj, field)
				j_formatter, err := reflections.GetFieldTag(obj, field, "formatter")
				if err == nil {
					switch j_formatter {
					case "RFC3339Milli":
						jsonBuf.WriteString("\"" + field_value.(time.Time).Format(RFC3339Milli) + "\"")
					default:
						if field_v, ok := field_value.(FrontEndMarshaller); ok {
							b, e := field_v.MarshalFrontEnd()
							if e == nil {
								jsonBuf.Write(b)
							}
						} else {
							enc.Encode(field_value)
						}
					}
				} else {
					jsonBuf.Write([]byte{'"', '"'})
				}
			}
		}
	}
	jsonBuf.WriteByte('}')
	return jsonBuf.Bytes(), nil
}
