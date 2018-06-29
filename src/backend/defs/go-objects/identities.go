// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"time"
)

type (
	//object stored in db
	UserIdentity struct {
		Credentials Credentials       `cql:"credentials"        json:"credentials,omitempty"                            patch:"user"`
		DisplayName string            `cql:"display_name"       json:"display_name"                                     patch:"user"`
		Identifier  string            `cql:"identifier"         json:"identifier"                                       patch:"identifier"` // for example: me@caliopen.org, @mastodon_account
		Infos       map[string]string `cql:"infos"              json:"infos"                                            patch:"user"`
		LastCheck   time.Time         `cql:"last_check"         json:"last_check,omitempty"                 formatter:"RFC3339Milli"`
		Protocol    string            `cql:"protocol"           json:"protocol"                                         patch:"user"` // for example: smtp,imap, mastodon
		Id          UUID              `cql:"identity_id"          json:"identity_id"`
		Status      string            `cql:"status"             json:"status"                                           patch:"user"` // for example : active, inactive, deleted
		Type        string            `cql:"type"               json:"type"                                             patch:"user"` // for example : local, remote
		UserId      UUID              `cql:"user_id"            json:"user_id"              frontend:"omit"`
	}

	// embedded in a contact
	SocialIdentity struct {
		Infos    map[string]string `cql:"infos"     json:"infos,omitempty"        patch:"user"`
		Name     string            `cql:"name"      json:"name,omitempty"         patch:"user"`
		SocialId UUID              `cql:"social_id" json:"social_id,omitempty"    patch:"system"`
		Type     string            `cql:"type"      json:"type,omitempty"         patch:"user"`
	}

	//reference embedded in a message
	Identity struct {
		Identifier string `cql:"identifier"     json:"identifier"` // legacy field, should be empty most of time
		Type       string `cql:"type"           json:"type"`       // legacy field, should be empty most of time
		Id         UUID   `cql:"identity_id"    json:"identity_id"`
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

	// cassandra table to lookup identities by identifier [and protocol]
	IdentityLookup struct {
		UserId     UUID   `cql:"user_id"`
		Identifier string `cql:"identifier"`
		Protocol   string `cql:"protocol"`
		IdentityId UUID   `cql:"identity_id"`
	}
)

/** identity **/
func (ui *UserIdentity) NewEmpty() interface{} {
	nui := new(UserIdentity)
	nui.Credentials = Credentials{}
	nui.Infos = map[string]string{}
	return nui
}

func (ui *UserIdentity) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return ui.UnmarshalMap(input)
}

func (ui *UserIdentity) UnmarshalMap(input map[string]interface{}) error {
	if credentials, ok := input["credentials"].(map[string]interface{}); ok {
		ui.Credentials = Credentials{}
		for k, v := range credentials {
			ui.Credentials[k] = v.(string)
		}
	}
	if dn, ok := input["display_name"].(string); ok {
		ui.DisplayName = dn
	}
	if infos, ok := input["infos"].(map[string]interface{}); ok {
		/*
			// create a new map, fill it with current values if any, then with values from input,
			// at last replace current map with new one.
			newMap := make(map[string]string)
			for k, v := range ui.Infos {
				newMap[k] = v
			}
			for k, v := range infos {
				newMap[k] = v.(string)
			}
			ui.Infos = newMap*/
		ui.Infos = make(map[string]string)
		for k, v := range infos {
			ui.Infos[k] = v.(string)
		}
	}

	if lc, ok := input["last_check"]; ok {
		ui.LastCheck, _ = time.Parse(time.RFC3339Nano, lc.(string))
	}
	if remote_id, ok := input["remote_id"].(string); ok {
		if id, err := uuid.FromString(remote_id); err == nil {
			ui.Id.UnmarshalBinary(id.Bytes())
		}
	}
	if status, ok := input["status"].(string); ok {
		ui.Status = status
	}
	if t, ok := input["type"].(string); ok {
		ui.Type = t
	}
	if userid, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userid); err == nil {
			ui.UserId.UnmarshalBinary(id.Bytes())
		}
	}
	return nil
}

func (ui *UserIdentity) JsonTags() (tags map[string]string) {
	return jsonTags(ui)
}

func (ui *UserIdentity) SortSlices() {
	//no slice to sort
}

// ensure mandatory properties are set, also default values.
func (ui *UserIdentity) MarshallNew(args ...interface{}) {
	if len(ui.Id) == 0 || (bytes.Equal(ui.Id.Bytes(), EmptyUUID.Bytes())) {
		ui.Id.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if (len(ui.UserId) == 0 || bytes.Equal(ui.UserId.Bytes(), EmptyUUID.Bytes())) && len(args) == 1 {
		switch args[0].(type) {
		case UUID:
			ui.UserId = args[0].(UUID)
		}
	}

}

// SetDefaults fills UserIdentity with default keys and values according to the type of the remote identity
func (ui *UserIdentity) SetDefaults() {
	defaults := map[string]string{}

	switch ui.Type {
	case "imap":
		defaults = map[string]string{
			"lastseenuid": "",
			"lastsync":    "", // RFC3339 date string
			"server":      "", // server hostname[|port]
			"uidvalidity": "", // uidvalidity to invalidate data if needed (see RFC4549#section-4.1)
		}
	}
	// defaults for every type
	defaults["pollinterval"] = "15" // how often remote account should be polled, in minutes.

	if ui.Infos == nil {
		(*ui).Infos = defaults
	} else {
		for default_key, default_value := range defaults {
			if v, ok := ui.Infos[default_key]; !ok || v == "" {
				(*ui).Infos[default_key] = default_value
			}
		}
	}

	if ui.Status == "" {
		(*ui).Status = "active"
	}

	if ui.Credentials == nil {
		(*ui).Credentials = Credentials{}
	}

	// try to set DisplayName if it is missing
	if ui.DisplayName == "" {
		switch ui.Type {
		case "imap":
			(*ui).DisplayName, _ = ui.Credentials["username"]
		}
	}

}

func (ui *UserIdentity) UnmarshalCQLMap(input map[string]interface{}) error {
	if credentials, ok := input["credentials"].(map[string]string); ok {
		ui.Credentials = Credentials{}
		for k, v := range credentials {
			ui.Credentials[k] = v
		}
	}
	if dn, ok := input["display_name"].(string); ok {
		ui.DisplayName = dn
	}

	if infos, ok := input["infos"].(map[string]string); ok {
		ui.Infos = make(map[string]string)
		for k, v := range infos {
			ui.Infos[k] = v
		}
	}
	if lc, ok := input["last_check"].(time.Time); ok {
		ui.LastCheck = lc
	}
	if remote_id, ok := input["remote_id"].(gocql.UUID); ok {
		ui.Id.UnmarshalBinary(remote_id.Bytes())
	}
	if status, ok := input["status"].(string); ok {
		ui.Status = status
	}
	if t, ok := input["type"].(string); ok {
		ui.Type = t
	}
	if userid, ok := input["user_id"].(gocql.UUID); ok {
		ui.UserId.UnmarshalBinary(userid.Bytes())
	}
	return nil
}

func (ui *UserIdentity) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", ui)
}

func (si *SocialIdentity) UnmarshalMap(input map[string]interface{}) error {
	si.Infos, _ = input["infos"].(map[string]string)
	si.Name, _ = input["name"].(string)
	if soc_id, ok := input["social_id"].(string); ok {
		if id, err := uuid.FromString(soc_id); err == nil {
			si.SocialId.UnmarshalBinary(id.Bytes())
		}
	}
	si.Type, _ = input["type"].(string)
	return nil //TODO: errors handling
}

func (i *Identity) UnmarshalMap(input map[string]interface{}) error {
	i.Identifier, _ = input["identifier"].(string)
	i.Type, _ = input["type"].(string)
	return nil //TODO: errors handling
}

// MarshallNew must be a variadic func to implement NewMarshaller interface,
// but SocialIdentity does not need params to marshal a well-formed SocialIdentity: ...interface{} is ignored
func (si *SocialIdentity) MarshallNew(...interface{}) {
	if len(si.SocialId) == 0 || (bytes.Equal(si.SocialId.Bytes(), EmptyUUID.Bytes())) {
		si.SocialId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

func (i *Identity) MarshallNew(...interface{}) {
	//nothing to enforce
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

type ByIdentifier []Identity

func (p ByIdentifier) Len() int {
	return len(p)
}

func (p ByIdentifier) Less(i, j int) bool {
	return p[i].Identifier < p[j].Identifier
}

func (p ByIdentifier) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
