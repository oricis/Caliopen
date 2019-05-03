package objects

import (
	"github.com/satori/go.uuid"
	"strings"
	"testing"
)

func TestComputeNewParticipantHash(t *testing.T) {
	current := ParticipantHash{
		UserId:     UUID(uuid.FromStringOrNil("ede04443-b60f-4869-9040-20bd6b1e33c1")),
		Kind:       "participants",
		Key:        "f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec",
		Components: []string{"email:dev@caliopen.local", "email:eliz@gnu.org", "email:kaushal.modi@gmail.com"},
	}
	uri := "email:eliz@gnu.org"
	contactId := "5f0baee8-1278-43eb-9931-01b7383b419b"
	newH, err := ComputeNewParticipantHash(uri, contactId, current, current.Components, true)
	if err != nil {
		t.Error(err)
	}
	if newH.Key != "a68a2042560695580765331e4fd528a611d27f5852b6d0dd499d8eccfc28f54b" {
		t.Errorf("expected new.Key = a68a2042560695580765331e4fd528a611d27f5852b6d0dd499d8eccfc28f54b, got %s", newH.Key)
	}
}

func TestHashFromParticipantsUris(t *testing.T) {
	participants := []Participant{
		{
			Address:  "kaushal.modi@gmail.com",
			Protocol: "email",
			Type:     "From",
		},
		{
			Address:  "dev@caliopen.local",
			Protocol: "email",
			Type:     "To",
		},
		{
			Address:  "eliz@gnu.org",
			Protocol: "email",
			Type:     "Cc",
		},
		{
			Address:  "dev@caliopen.local",
			Protocol: "email",
			Type:     "Cc",
		},
	}
	hash, components, err := HashFromParticipantsUris(participants)
	if err != nil {
		t.Error(err)
	}
	if hash != "f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec" {
		t.Errorf("expected hash f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec, got %s", hash)
	}
	if !strings.EqualFold("email:dev@caliopen.localemail:eliz@gnu.orgemail:kaushal.modi@gmail.com", strings.Join(components, "")) {
		t.Errorf("expected components = email:dev@caliopen.localemail:eliz@gnu.orgemail:kaushal.modi@gmail.com, got %s", strings.Join(components, ""))
	}
	/*


		hash = f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec
	*/
}
