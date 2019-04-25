package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/backendstest"
	"github.com/satori/go.uuid"
	"testing"
)

func TestCassandraBackend_ControlURIsUniqueness(t *testing.T) {
	cb := backendstest.GetContactBackend()
	// test uris not available
	checkList := ControlURIsUniqueness(cb, &Contact{
		Emails: []EmailContact{
			{
				Address:   "emma@recovery-caliopen.local",
				EmailId:   UUID(uuid.FromStringOrNil("444d71f6-324c-4733-88a2-77ca28ea6d2d")),
				IsPrimary: false,
				Label:     "emma@recovery-caliopen.local",
				Type:      "other",
			},
		},
	})
	if len(checkList) == 0 {
		t.Error("expected an non empty checklit, got empty")
	} else {
		if check, ok := checkList["email:emma@recovery-caliopen.local"]; ok {
			if check.Ok {
				t.Error("expected <email:emma@recovery-caliopen.local> to be unavailable, got OK == true")
			} else if check.OtherContact != "63ab7904-c416-4f1a-9652-3de82e4fd1f1" {
				t.Errorf("expected to find another contact with id = 63ab7904-c416-4f1a-9652-3de82e4fd1f1, got %s", check.OtherContact)
			}
		} else {
			t.Error("expected to find key <email:emma@recovery-caliopen.local>")
		}
	}

	checkList = ControlURIsUniqueness(cb, &Contact{
		Emails: []EmailContact{
			{
				Address:   "emma@recovery-caliopen.local",
				EmailId:   UUID(uuid.FromStringOrNil("444d71f6-324c-4733-88a2-77ca28ea6d2d")),
				IsPrimary: false,
				Label:     "emma@recovery-caliopen.local",
				Type:      "other",
			},
		},
		Identities: []SocialIdentity{
			{
				Name: "emmatomme",
				Type: "twitter",
			},
		},
	})
	// TODO
	t.Log(checkList)
	checkList = ControlURIsUniqueness(cb, &Contact{
		Emails: []EmailContact{
			{
				Address: "elvis@able",
				Type:    "other",
			},
		},
		Identities: []SocialIdentity{
			{
				Name: "toto",
				Type: "twitter",
			},
		},
	})
	// TODO
	t.Log(checkList)
}
