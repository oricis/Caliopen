// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/backendstest"
	"testing"
)

func TestRESTfacility_addIdentityToContact(t *testing.T) {
	// test adding an email account
	remoteEmail := backendstest.RemoteIdentities[backendstest.DevIdoireUserId+"7e356efb-d24c-493a-b558-e58c7ad20ac3"]
	contact := backendstest.Contacts[backendstest.DevIdoireUserId+"5f0baee8-1278-43eb-9931-01b7383b419b"]
	newContact, err := addIdentityToContact(&backendstest.ContactsBackend{}, &backendstest.ContactsIndex{}, &backendstest.UsersBackend{}, *remoteEmail, contact)
	if err != nil {
		t.Errorf("add email identity returns error : %s. Cause : %s. Code : %d", err, err.Cause(), err.Code())
	}
	if newContact == nil {
		t.Error("expected add email identity returned a reference to a new Contact, got nil")
	}
	if len(newContact.Emails) != 2 {
		t.Errorf("expected newContact.Emails with 2 elements, got %d", len(newContact.Emails))
	} else {
		contactEmail := EmailContact{
			Address:   remoteEmail.Identifier,
			IsPrimary: false,
			Label:     remoteEmail.DisplayName,
			Type:      "other",
		}
		newContactEmail := newContact.Emails[1]
		if newContactEmail.IsPrimary {
			t.Errorf("expected newContactEmail.IsPrimary set to false, got true")
		}
		if newContactEmail.Address != contactEmail.Address {
			t.Errorf("expected newContactEmail.Address set to %s, got %s", contactEmail.Address, newContactEmail.Address)
		}
		if newContactEmail.Label != contactEmail.Label {
			t.Errorf("expected newContactEmail.Label set to %s, got %s", contactEmail.Label, newContactEmail.Label)
		}
		if newContactEmail.Type != contactEmail.Type {
			t.Errorf("expected newContactEmail.Type set to %s, got %s", contactEmail.Type, newContactEmail.Type)
		}
	}

	// test adding a Twitter account
	remoteTw := backendstest.RemoteIdentities[backendstest.EmmaTommeUserId+"b91f0fa8-17a2-4729-8a5a-5ff58ee5c121"]
	contact = backendstest.Contacts[backendstest.EmmaTommeUserId+"63ab7904-c416-4f1a-9652-3de82e4fd1f1"]
	newContact, err = addIdentityToContact(&backendstest.ContactsBackend{}, &backendstest.ContactsIndex{}, &backendstest.UsersBackend{}, *remoteTw, contact)
	if err != nil {
		t.Errorf("add twitter identity returns error : %s. Cause : %s. Code : %d", err, err.Cause(), err.Code())
	}
	if newContact == nil {
		t.Error("expected add twitter identity returned a reference to a new Contact, got nil")
	}
	if len(newContact.Identities) != 1 {
		t.Errorf("expected newContact.Identities with 1 element, got %d", len(newContact.Identities))
	} else {
		contactTwitter := SocialIdentity{
			Type: TwitterProtocol,
			Name: remoteTw.Identifier,
			Infos: map[string]string{
				"twitterid":   remoteTw.Infos["twitterid"],
				"screen_name": remoteTw.Identifier,
			},
		}
		newContactTw := newContact.Identities[0]
		if newContactTw.Type != contactTwitter.Type {
			t.Errorf("expected newContact.Identity.Type set to %s, got %s", contactTwitter.Type, newContactTw.Type)
		}
		if newContactTw.Name != contactTwitter.Name {
			t.Errorf("expected newContact.Identity.Name set to %s, got %s", contactTwitter.Name, newContactTw.Name)
		}
		if len(newContactTw.Infos) != 2 {
			t.Errorf("expected infos map with 2 elements, got %d", len(newContactTw.Infos))
		} else {
			if v, ok := newContactTw.Infos["twitterid"]; !ok || v != contactTwitter.Infos["twitterid"] {
				t.Errorf("expected newContact.Infos['twitterid'] set to %s, got %s", contactTwitter.Infos["twitterid"], newContactTw.Infos["twitterid"])
			}
			if v, ok := newContactTw.Infos["screen_name"]; !ok || v != contactTwitter.Infos["screen_name"] {
				t.Errorf("expected newContact.Infos['screen_name'] set to %s, got %s", contactTwitter.Infos["screen_name"], newContactTw.Infos["screen_name"])
			}
		}
	}

}
