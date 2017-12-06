// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

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
func ParsePatch(json []byte) (*gjson.Result, error) {
	if !gjson.Valid(string(json)) {
		return nil, errors.New("invalid json")
	}
	r := gjson.ParseBytes(json)
	return &r, nil
}

// ValidatePatchSemantic verifies if the provided patch — a json — could be applied to the given object.
// json is semantically checked regarding the obj it should apply to,
// meaning json's keys must be consistent with obj's properties.
// if validation passes, func returns nil
func ValidatePatchSemantic(obj CaliopenObject, patch *gjson.Result) error {
	var err error
	current_state := patch.Get("current_state")
	if !current_state.Exists() {
		return errors.New("[Patch] missing 'current_state' property in patch json")
	}
	if !current_state.IsObject() {
		return errors.New("[Patch] 'current_state' property in patch json is not an object")
	}

	// check if each key in the json has a corresponding property in obj
	// NB : this check is for consistency only, because unknown keys will be simply ignored when unmarshalling JSON.
	jsonTags := obj.JsonTags()
	keyValidator := func(key, value gjson.Result) bool {
		if key.String() != "current_state" {
			key_name := jsonTags[key.String()]
			var ok bool
			if ok, err = reflections.HasField(obj, key_name); !ok || err != nil {
				err = errors.New(fmt.Sprintf("[Patch] found invalid key <%s> in the json patch", key.String()))
				return false
			} else {
				return true
			}
		}
		return true
	}
	patch.ForEach(keyValidator)
	if err == nil {
		current_state.ForEach(keyValidator)
	}

	return err
}

// ValidatePatchCurrentState verifies if the provided current_state within a json patch
// is consistent with the provided object (coming from db for example).
func ValidatePatchCurrentState(obj CaliopenObject, patch *gjson.Result) error {
	var err error
	valid := true
	// build one sibling from patch
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
			return false
		}
		if !reflect.DeepEqual(current, store) {
			valid = false
			err = errors.New(fmt.Sprintf("[Patch] current_state for field <%s> not consistent with stored value", field_name))
			return false
		}
		return true
	})
	if !valid {
		return err
	} else {
		return nil
	}
}

// UpdateWithPatch updates obj attributes with values provided in the patch.
// initiator is needed for the function to allow/disallow updates on properties that may be protected,
// ("patch" tag within object definition is checked against the "initiator" to allow/prevent the modification).
// Patch will be pre-processed by ValidatePatchSemantic and ValidatePatchCurrentState before being applied to object.
func UpdateWithPatch(obj CaliopenObject, patch []byte, actor Initiator) error {
	pp, err := ParsePatch(patch)
	if err != nil {
		return err
	}

	if err = ValidatePatchSemantic(obj, pp); err != nil {
		return err
	}

	if err = ValidatePatchCurrentState(obj, pp); err != nil {
		return err
	}

	jsonTags := obj.JsonTags()

	var er error
	pp.ForEach(func(key, value gjson.Result) bool {
		if key.Str != "current_state" {
			field_name := jsonTags[key.String()]
			if !canModifyProperty(obj, field_name, actor) { // checks if initiator has rights to modify the field
				er = fmt.Errorf("current actor can't modify field %s", field_name)
				return false
			}
		}
		return true
	})
	if er != nil {
		return er
	}

	return obj.UnmarshalJSON(patch)
}

// canModifyProperty returns true if and only if Initiator has rights to modify the property of the object.
// func makes use of "patch" tag found (or not found) within struct declaration
func canModifyProperty(obj CaliopenObject, field string, actor Initiator) bool {
	rightLevel := Unknown
	directive, err := reflections.GetFieldTag(obj, field, "patch")
	if directive == "" || err != nil {
		rightLevel = SystemActor
	} else {
		if level, ok := Initiators[directive]; !ok {
			rightLevel = SystemActor
		} else {
			rightLevel = level
		}
	}

	return rightLevel >= actor // if rightLevel is below actor level, then actor has not the right to modify
}
