package helpers

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/tidwall/gjson"
	"gopkg.in/oleiade/reflections.v1"
	"reflect"
)

// func to do the parsing once and get a pointer to the result.
func ParsePatch(json []byte) *gjson.Result {
	r := gjson.ParseBytes(json)
	return &r
}

// ValidatePatchSemantic verifies if the provided patch — a json — could be applied to the given object.
// json is semantically checked regarding the obj it should apply to,
// meaning json's keys must be consistent with obj's properties.
// if validation passes, func returns
func ValidatePatchSemantic(obj CaliopenObject, patch *gjson.Result) (valid bool, err error) {
	valid = true
	current_state := patch.Get("current_state")
	if !current_state.Exists() {
		return false, errors.New("[Patch] missing 'current_state' property in patch json")
	}
	if !current_state.IsObject() {
		return false, errors.New("[Patch] 'current_state' property in patch json is not an object")
	}

	// check if each key in the json has a corresponding property in obj
	// NB : this check is for consistency only, because unknown keys could be simply ignored when unmarshalling JSON.
	jsonTags := obj.JsonTags()
	keyValidator := func(key, value gjson.Result) bool {
		if key.String() != "current_state" {
			key_name := jsonTags[key.String()]
			var ok bool
			if ok, err = reflections.HasField(obj, key_name); !ok || err != nil {
				valid = false
				err = errors.New(fmt.Sprintf("[Patch] found invalid key <%s> in the json patch", key.String()))
				return false
			} else {
				return true
			}
		}
		return true
	}
	patch.ForEach(keyValidator)
	current_state.ForEach(keyValidator)

	return
}

// ValidatePatchCurrentState verifies if the provided current_state, within a json patch, is consistent with storage.
func ValidatePatchCurrentState(obj CaliopenObject, patch *gjson.Result) (valid bool, err error) {
	valid = true
	// build one obj sibling from patch
	current_state := patch.Get("current_state")
	patch_current := obj.NewEmpty().(CaliopenObject)
	patch_current.UnmarshalJSON([]byte(current_state.Raw))

	jsonTags := obj.JsonTags()
	current_state.ForEach(func(key, value gjson.Result) bool {
		var e error
		field_name := jsonTags[key.String()]
		current, e := reflections.GetField(patch_current, field_name)
		store, e := reflections.GetField(obj, field_name)
		if e != nil {
			valid = false
			err = errors.New(fmt.Sprintf("[Patch] failed to retrieve field <%s> from object", field_name))
		}
		if !reflect.DeepEqual(current, store) {
			valid = false
			err = errors.New(fmt.Sprintf("[Patch] current_state for field <%s> not consitent with stored value", field_name))
			return false
		}
		return true
	})
	return
}

// UpdateWithPatch updates obj attributes with values provided in the patch
// obj must be a pointer to an object belongings to the objects package
func UpdateWithPatch(obj CaliopenObject, patch []byte) error {
	return nil
}
