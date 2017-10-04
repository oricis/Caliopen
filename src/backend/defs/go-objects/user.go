// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.
//
// only struct and interfaces definitions in this pkg

package objects

import (
	"encoding/json"
	"github.com/satori/go.uuid"
	"time"
)

type User struct {
	ContactId        UUID              `cql:"contact_id"               json:"contact_id"`
	DateInsert       time.Time         `cql:"date_insert"              json:"date_insert"                              formatter:"RFC3339Milli"`
	FamilyName       string            `cql:"family_name"              json:"family_name"`
	GivenName        string            `cql:"given_name"               json:"given_name"`
	LocalIdentities  []LocalIdentity   `cql:"local_identities"         json:"local_identities"`
	MainUserId       UUID              `cql:"main_user_id"             json:"main_user_id"`
	Name             string            `cql:"name"                     json:"name"`
	Params           map[string]string `cql:"params"                   json:"params"`
	Password         string            `cql:"password"                 json:"password"`
	PrivacyIndex     *PrivacyIndex     `cql:"privacy_index"            json:"privacy_index"`
	*PrivacyFeatures `cql:"privacy_features"         json:"privacy_features"`
	RecoveryMail     string `cql:"recovery_mail"            json:"recovery_mail"`
	UserId           UUID   `cql:"user_id"                  json:"user_id"              elastic:"omit"      formatter:"rfc4122"`
}

// unmarshal a map[string]interface{} that must owns all Contact's fields
// typical usage is for unmarshaling response from Cassandra backend
func (user *User) UnmarshalCQLMap(input map[string]interface{}) {
	//TODO
}

func (user *User) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return user.UnmarshalMap(input)
}

func (user *User) UnmarshalMap(input map[string]interface{}) error {

	if contact_id, ok := input["contact_id"].(string); ok {
		if id, err := uuid.FromString(contact_id); err == nil {
			user.ContactId.UnmarshalBinary(id.Bytes())
		}
	}

	if date, ok := input["date_insert"]; ok {
		user.DateInsert, _ = time.Parse(time.RFC3339Nano, date.(string))
	}

	user.FamilyName, _ = input["family_name"].(string)
	user.GivenName, _ = input["given_name"].(string)

	if identities, ok := input["local_identities"]; ok {
		for _, identity := range identities.([]interface{}) {
			I := new(LocalIdentity)
			if err := I.UnmarshalMap(identity.(map[string]interface{})); err == nil {
				user.LocalIdentities = append(user.LocalIdentities, *I)
			}
		}
	}

	if main_user_id, ok := input["main_user_id"].(string); ok {
		if id, err := uuid.FromString(main_user_id); err == nil {
			user.MainUserId.UnmarshalBinary(id.Bytes())
		}
	}

	user.Name, _ = input["name"].(string)
	user.Params, _ = input["params"].(map[string]string)
	user.Password, _ = input["password"].(string)

	if pi, ok := input["privacy_index"]; ok {
		PI := new(PrivacyIndex)
		if err := PI.UnmarshalMap(pi.(map[string]interface{})); err == nil {
			user.PrivacyIndex = PI
		}
	}

	if pf, ok := input["privacy_features"]; ok {
		PF := &PrivacyFeatures{}
		PF.UnmarshalMap(pf.(map[string]interface{}))
		user.PrivacyFeatures = PF
	}

	user.RecoveryMail, _ = input["recovery_mail"].(string)

	if user_id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(user_id); err == nil {
			user.UserId.UnmarshalBinary(id.Bytes())
		}
	}

	return nil
}

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaler takes account of custom tags for given 'context'
func (user *User) JSONMarshaller(context string, body_type ...string) ([]byte, error) {
	//TODO
	return []byte{}, nil
}

func (user *User) MarshalJSON() ([]byte, error) {
	//TODO
	return []byte{}, nil
}

// return a JSON representation of Message suitable for frontend client
func (user *User) MarshalFrontEnd(body_type string) ([]byte, error) {
	//TODO
	return []byte{}, nil
}

// implementation of the CaliopenObject interface
func (user *User) JsonTags() (tags map[string]string) {
	return jsonTags(user)
}

func (user *User) NewEmpty() interface{} {
	u := new(User)
	u.LocalIdentities = []LocalIdentity{}
	u.Params = make(map[string]string)
	u.PrivacyIndex = &PrivacyIndex{}
	return u
}
