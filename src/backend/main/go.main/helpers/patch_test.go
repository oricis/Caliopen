package helpers

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"testing"
)

func TestValidatePatchSemantic(t *testing.T) {
	patch := []byte(`{
	"body_plain":"the content",
	"subject": "le sujet",
	"user_id": "fb8c009e-c921-49a0-80e1-01f1ab1101cb",
	"current_state":
		{
			"body_plain":"empty",
			"subject":"current subject"
		}
	}`)
	//a basic Message that should have been retrieved from db
	msg := new(Message)
	msg.Body_plain = "empty"
	msg.Subject = "current subject"
	p := ParsePatch(patch)
	v, e := ValidatePatchSemantic(msg, p)
	t.Logf("valid: %t, error: %s\n", v, e)
	v, e = ValidatePatchCurrentState(msg, p)
	t.Logf("valid: %t, error: %s\n", v, e)
}
