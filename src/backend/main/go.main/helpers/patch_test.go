// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/satori/go.uuid"
	"testing"
)

func TestValidatePatchSemantic(t *testing.T) {
	msg := getAMessage()
	msg_p := ParsePatch([]byte(msg_patch))
	v, e := ValidatePatchSemantic(msg, msg_p)
	t.Logf("Message patch semantic => valid: %t, error: %s\n", v, e)
	user := getAUser()
	user_p := ParsePatch([]byte(user_patch))
	v, e = ValidatePatchSemantic(user, user_p)
	t.Logf("User patch semantic => valid: %t, error: %s\n", v, e)
}

func TestValidatePatchCurrentState(t *testing.T) {
	msg := getAMessage()
	p := ParsePatch([]byte(msg_patch))
	v, e := ValidatePatchCurrentState(msg, p)
	t.Logf("Message patch current state => valid: %t, error: %s\n", v, e)
	user := getAUser()
	user_p := ParsePatch([]byte(user_patch))
	v, e = ValidatePatchCurrentState(user, user_p)
	t.Logf("User patch current state => valid: %t, error: %s\n", v, e)
}

// returns a basic Message that should have been retrieved from db
func getAMessage() *Message {
	msg := new(Message)
	msg.Body_plain = "empty"
	msg.Subject = "current subject"
	id, _ := uuid.FromString("fb8c009e-c921-49a0-80e1-01f1ab1101cb")
	msg.User_id.UnmarshalBinary(id.Bytes())
	identities := []Identity{
		{
			"dev@caliopen.local",
			"email",
		},
	}
	msg.Identities = identities
	return msg
}

// returns a basic User that should have been retrieved from db
func getAUser() *User {
	u := new(User)
	id, _ := uuid.FromString("fb8c009e-c921-49a0-80e1-01f1ab1101cb")
	u.UserId.UnmarshalBinary(id.Bytes())
	u.Password = "1234"
	u.PrivacyFeatures = &PrivacyFeatures{"password_strength": "0"}
	return u
}

const (
	msg_patch = string(`{
	"body_plain":"the content",
	"subject": "le sujet",
	"user_id": "fb8c009e-c921-49a0-80e1-01f1ab1101cb",
		"identities": [{
		"identifier": "dev@caliopen.local",
		"type": "email"
	}],
	"current_state":
		{
			"body_plain":"empty",
			"subject":"current subject",
			"user_id": "fb8c009e-c921-49a0-80e1-01f1ab1101cb",
			"identities": [{
				"identifier": "dev@caliopen.local",
				"type": "email"
			}]
		}
	}`)
	user_patch = string(`{
	"user_id": "fb8c009e-c921-49a0-80e1-01f1ab1101cb",
	"password": "1234",
	"current_state":
		{
		"user_id": "fb8c009e-c921-49a0-80e1-01f1ab1101cb",
		"password": "1234",
		"privacy_features":
			{
				"password_strength": "0"
			}
		}
	}`)
)
