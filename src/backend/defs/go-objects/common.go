package objects

import "gopkg.in/oleiade/reflections.v1"

// this interface is mainly a collection of helpers to facilitate the job of reflection
type CaliopenObject interface {
	// JsonTags returns a map[string]string of the json tags found for each object property
	// key is the tag name, value is the corresponding property name
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
