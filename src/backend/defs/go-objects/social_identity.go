// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"github.com/satori/go.uuid"
)

type (
	// embedded in a contact
	SocialIdentity struct {
		Infos    map[string]string `cql:"infos"     json:"infos,omitempty"        patch:"user"`
		Name     string            `cql:"name"      json:"name,omitempty"         patch:"user"`
		SocialId UUID              `cql:"social_id" json:"social_id,omitempty"    patch:"system"`
		Type     string            `cql:"type"      json:"type,omitempty"         patch:"user"`
	}

	// Mean of communication for a contact, with on-demand calculated PI.
	ContactIdentity struct {
		Identifier   string       `json:"identifier"` // the 'I' like in URI, ie : the email address for email ; the user's real name for IRC
		Label        string       `json:"label"`      // the 'display-name' field in email address if available ; the 'nickname' for IRC
		PrivacyIndex PrivacyIndex `json:"privacy_index"`
		Protocol     string       `json:"protocol"` // email, irc, sms, etc.
	}

	//struct returned to user by suggest engine when performing a string query search
	RecipientSuggestion struct {
		Address    string `json:"address,omitempty"`    // could be empty if suggestion is a contact (or should we automatically put preferred identity's address ?)
		Contact_Id string `json:"contact_id,omitempty"` // contact's ID if any
		Label      string `json:"label,omitempty"`      // name of contact or <display-name> in case of an address returned from participants lookup, if any
		Protocol   string `json:"protocol,omitempty"`   // email, IRC…
		Source     string `json:"source,omitempty"`     // "participant" or "contact", ie from where this suggestion came from
	}
)

func (si *SocialIdentity) UnmarshalMap(input map[string]interface{}) error {
	if infos, ok := input["infos"].(map[string]interface{}); ok {
		for k, v := range infos {
			si.Infos[k] = v.(string)
		}
	}
	si.Name, _ = input["name"].(string)
	if soc_id, ok := input["social_id"].(string); ok {
		if id, err := uuid.FromString(soc_id); err == nil {
			si.SocialId.UnmarshalBinary(id.Bytes())
		}
	}
	si.Type, _ = input["type"].(string)
	return nil //TODO: errors handling
}

// MarshallNew must be a variadic func to implement NewMarshaller interface,
// but SocialIdentity does not need params to marshal a well-formed SocialIdentity: ...interface{} is ignored
func (si *SocialIdentity) MarshallNew(...interface{}) {
	if len(si.SocialId) == 0 || (bytes.Equal(si.SocialId.Bytes(), EmptyUUID.Bytes())) {
		si.SocialId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

func (si *SocialIdentity) NewEmpty() interface{} {
	newSi := new(SocialIdentity)
	newSi.Infos = map[string]string{}
	return newSi
}

// Sort interface implementations
type BySocialIdentityID []SocialIdentity

func (p BySocialIdentityID) Len() int {
	return len(p)
}

func (p BySocialIdentityID) Less(i, j int) bool {
	return p[i].SocialId.String() < p[j].SocialId.String()
}

func (p BySocialIdentityID) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
