// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import "gopkg.in/oleiade/reflections.v1"

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

// generic implementation of the jsonTags func for CaliopenObject interface
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
