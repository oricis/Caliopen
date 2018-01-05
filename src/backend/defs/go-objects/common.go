// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"gopkg.in/oleiade/reflections.v1"
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
		GetRelated() map[string]interface{}
	}

	// objects with related tables that must be maintained up-to-date
	HasLookup interface {
		GetLookup() map[string]interface{}
	}

	NewMarshaller interface {
		MarshallNew() // ensure that mandatory properties are correctly set on new structs.
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

// MarshalNested calls MarshalNew() on embedded structs
func MarshalNested(obj HasNested) {
	for nested := range obj.GetSetNested() {
		if nest, ok := nested.(NewMarshaller); ok {
			nest.MarshallNew()
		}
	}
}
