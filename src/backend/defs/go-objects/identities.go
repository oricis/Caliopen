// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"time"
)

type (
	//object stored in db
	LocalIdentity struct {
		Display_name string `cql:"display_name"            json:"display_name"`
		Identifier   string `cql:"identifier"              json:"identifier"`
		Status       string `cql:"status"                  json:"status"`
		Type         string `cql:"type"                    json:"type"`
		User_id      UUID   `cql:"user_id"                 json:"user_id"           formatter:"rfc4122"`
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
		Identifier string `cql:"identifier"     json:"identifier"`
		Type       string `cql:"type"           json:"type"`
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

	//struct to store external user accounts
	RemoteIdentity struct {
		Credentials Credentials       `cql:"credentials"        json:"credentials,omitempty"                            patch:"user"`
		DisplayName string            `cql:"display_name"       json:"display_name"                                     patch:"user"`
		Identifier  string            `cql:"identifier"         json:"identifier"                                       patch:"user"`
		Infos       map[string]string `cql:"infos"              json:"infos"                                            patch:"user"`
		LastCheck   time.Time         `cql:"last_check"         json:"last_check,omitempty"                 formatter:"RFC3339Milli"`
		RemoteId    UUID              `cql:"remote_id"          json:"remote_id"`
		Status      string            `cql:"status"             json:"status"                                           patch:"user"` // for example : active, inactive, deleted
		Type        string            `cql:"type"               json:"type"                                             patch:"user"` // for example : imap, twitter…
		UserId      UUID              `cql:"user_id"            json:"user_id"              frontend:"omit"`
	}

	// RemoteByIdentifier is the model of a Cassandrà table to lookup remote identities by their identifier
	RemoteByIdentifier struct {
		UserId     string `cql:"user_id"`
		Identifier string `cql:"identifier"`
		RemoteId   string `cql:"remote_id"`
	}
)

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

func (li *LocalIdentity) UnmarshalMap(input map[string]interface{}) error {
	li.Display_name, _ = input["display_name"].(string)
	li.Identifier, _ = input["identifier"].(string)
	li.Status, _ = input["status"].(string)
	li.Type, _ = input["type"].(string)
	if user_id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(user_id); err == nil {
			li.User_id.UnmarshalBinary(id.Bytes())
		}
	}
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

/** remote identity **/
func (ri *RemoteIdentity) NewEmpty() interface{} {
	nri := new(RemoteIdentity)
	nri.Credentials = Credentials{}
	nri.Infos = map[string]string{}
	return nri
}

func (ri *RemoteIdentity) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return ri.UnmarshalMap(input)
}

func (ri *RemoteIdentity) UnmarshalMap(input map[string]interface{}) error {
	if credentials, ok := input["credentials"].(map[string]interface{}); ok {
		ri.Credentials = Credentials{}
		for k, v := range credentials {
			ri.Credentials[k] = v.(string)
		}
	}
	if dn, ok := input["display_name"].(string); ok {
		ri.DisplayName = dn
	}
	if identifier, ok := input["identifier"].(string); ok {
		ri.Identifier = identifier
	}
	if infos, ok := input["infos"].(map[string]interface{}); ok {
		/*
			// create a new map, fill it with current values if any, then with values from input,
			// at last replace current map with new one.
			newMap := make(map[string]string)
			for k, v := range ri.Infos {
				newMap[k] = v
			}
			for k, v := range infos {
				newMap[k] = v.(string)
			}
			ri.Infos = newMap*/
		ri.Infos = make(map[string]string)
		for k, v := range infos {
			ri.Infos[k] = v.(string)
		}
	}

	if lc, ok := input["last_check"]; ok {
		ri.LastCheck, _ = time.Parse(time.RFC3339Nano, lc.(string))
	}
	if remote_id, ok := input["remote_id"].(string); ok {
		if id, err := uuid.FromString(remote_id); err == nil {
			ri.RemoteId.UnmarshalBinary(id.Bytes())
		}
	}
	if status, ok := input["status"].(string); ok {
		ri.Status = status
	}
	if t, ok := input["type"].(string); ok {
		ri.Type = t
	}
	if userid, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userid); err == nil {
			ri.UserId.UnmarshalBinary(id.Bytes())
		}
	}
	return nil
}

func (ri *RemoteIdentity) JsonTags() (tags map[string]string) {
	return jsonTags(ri)
}

func (ri *RemoteIdentity) SortSlices() {
	//no slice to sort
}

// ensure mandatory properties are set, also default values.
func (ri *RemoteIdentity) MarshallNew(args ...interface{}) {
	if len(ri.RemoteId) == 0 || (bytes.Equal(ri.RemoteId.Bytes(), EmptyUUID.Bytes())) {
		ri.RemoteId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if (len(ri.UserId) == 0 || bytes.Equal(ri.UserId.Bytes(), EmptyUUID.Bytes())) && len(args) == 1 {
		switch args[0].(type) {
		case UUID:
			ri.UserId = args[0].(UUID)
		}
	}

}

// SetDefaults fills RemoteIdentity with default keys and values according to the type of the remote identity
func (ri *RemoteIdentity) SetDefaults() {
	defaults := map[string]string{}

	switch ri.Type {
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

	if ri.Infos == nil {
		(*ri).Infos = defaults
	} else {
		for default_key, default_value := range defaults {
			if v, ok := ri.Infos[default_key]; !ok || v == "" {
				(*ri).Infos[default_key] = default_value
			}
		}
	}

	if ri.Status == "" {
		(*ri).Status = "active"
	}

	if ri.Credentials == nil {
		(*ri).Credentials = Credentials{}
	}

	// try to set identifier if it is missing
	if ri.Identifier == "" {
		switch ri.Type {
		case "imap":
			(*ri).Identifier, _ = ri.Credentials["username"]
		}
	}

	if ri.DisplayName == "" {
		(*ri).DisplayName = ri.Identifier
	}
}

func (ri *RemoteIdentity) UnmarshalCQLMap(input map[string]interface{}) error {
	if credentials, ok := input["credentials"].(map[string]string); ok {
		ri.Credentials = Credentials{}
		for k, v := range credentials {
			ri.Credentials[k] = v
		}
	}
	if dn, ok := input["display_name"].(string); ok {
		ri.DisplayName = dn
	}
	if identifier, ok := input["identifier"].(string); ok {
		ri.Identifier = identifier
	}
	if infos, ok := input["infos"].(map[string]string); ok {
		ri.Infos = make(map[string]string)
		for k, v := range infos {
			ri.Infos[k] = v
		}
	}
	if lc, ok := input["last_check"].(time.Time); ok {
		ri.LastCheck = lc
	}
	if remote_id, ok := input["remote_id"].(gocql.UUID); ok {
		ri.RemoteId.UnmarshalBinary(remote_id.Bytes())
	}
	if status, ok := input["status"].(string); ok {
		ri.Status = status
	}
	if t, ok := input["type"].(string); ok {
		ri.Type = t
	}
	if userid, ok := input["user_id"].(gocql.UUID); ok {
		ri.UserId.UnmarshalBinary(userid.Bytes())
	}
	return nil
}

func (ri *RemoteIdentity) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", ri)
}

// HasLookup interface to update remote_identifier lookup table
// this lookup table allow to retrieve a remote by its identifier
func (ri *RemoteIdentity) GetLookupsTables() map[string]StoreLookup {
	return map[string]StoreLookup{
		"remote_identifier": &RemoteByIdentifier{},
	}
}

// GetLookupKeys returns a chan to iterate over fields and values that make up the lookup tables keys
func (ri *RemoteIdentity) GetLookupKeys() <-chan StoreLookup {
	getter := make(chan StoreLookup)

	go func(chan StoreLookup) {
		getter <- &RemoteByIdentifier{
			UserId:     ri.UserId.String(),
			Identifier: ri.Identifier,
			RemoteId:   ri.RemoteId.String(),
		}
		close(getter)
	}(getter)

	return getter
}

// CleanupLookups implements StoreLookup interface.
// It returns a func which removes all RemoteByIdentifier related to the RemoteIdentity given as param of the variadic func.
func (rbi *RemoteByIdentifier) CleanupLookups(remotes ...interface{}) func(session *gocql.Session) error {
	if len(remotes) == 1 {
		remote := remotes[0].(*RemoteIdentity)
		return func(session *gocql.Session) error {
			err := session.Query(`DELETE FROM remote_identifier WHERE user_id = ? AND identifier = ?`,
				remote.UserId.String(), remote.Identifier).Exec()
			if err != nil {
				return err
			}

			return nil
		}
	}
	return nil
}

// UpdateLookups iterates over remote identity's lokups to add/update them to the relevant table,
// then it deletes lookups referencs that are no more linked to an embedded key which has been removed,
// `remotes` param should have one item in the context of a creation or 2 items [new, old] in the context of an update
func (rbi *RemoteByIdentifier) UpdateLookups(remotes ...interface{}) func(session *gocql.Session) error {
	remotesLen := len(remotes)
	update := false
	if remotesLen > 0 {
		newRemote := remotes[0].(*RemoteIdentity)
		var oldLookup map[string]*RemoteByIdentifier
		return func(session *gocql.Session) error {
			if remotesLen == 2 && remotes[1] != nil {
				// it's an update
				update = true
				oldRemote := remotes[1].(*RemoteIdentity)
				oldLookup = map[string]*RemoteByIdentifier{} // build strings with cassa's keys
				for lookup := range oldRemote.GetLookupKeys() {
					lkp := lookup.(*RemoteByIdentifier)
					oldLookup[lkp.UserId+lkp.Identifier] = lkp
				}
			}

			// iterate over remote's current state to add or update lookups
			for lookup := range newRemote.GetLookupKeys() {
				lkp := lookup.(*RemoteByIdentifier)
				// try te get remote_identifier
				var remoteId gocql.UUID
				session.Query(`SELECT remote_id FROM remote_identifier WHERE user_id = ? AND identifier = ?`,
					lkp.UserId,
					lkp.Identifier).Scan(&remoteId)
				if remoteId.String() == "" { // remote_identifier lookup not found => set one
					err := session.Query(`INSERT INTO remote_identifier (user_id, identifier, remote_id) VALUES (?,?,?)`,
						lkp.UserId,
						lkp.Identifier,
						newRemote.RemoteId.String()).Exec()
					if err != nil {
						log.WithError(err).Warnf(`[CassandraBackend] UpdateLookups INSERT failed for user: %s, identifier: %s`,
							lkp.UserId,
							lkp.Identifier)
					}
				} else { // remote_identifier entry found => update if needed
					if remoteId.String() != newRemote.UserId.String() {
						err := session.Query(`INSERT INTO remote_identifier (user_id, identifier, remote_id) VALUES (?,?,?)`,
							lkp.UserId,
							lkp.Identifier,
							lkp.RemoteId).Exec()
						if err != nil {
							log.WithError(err).Warnf(`[CassandraBackend] UpdateLookups INSERT failed for user: %s, identifier: %s`,
								lkp.UserId,
								lkp.Identifier)
						}
					}

				}
				if update {
					// remove keys in current states,
					// thus oldLookup map will only holds remaining entries that are not in the new state
					delete(oldLookup, lkp.UserId+lkp.Identifier)
				}
			}
			if len(oldLookup) > 0 {
				// it remains lookups in the map, meaning identifier has been changed
				// need to remove it from lookup table
				for _, lookup := range oldLookup {
					err := session.Query(`DELETE FROM remote_identifier WHERE user_id = ? AND identifier = ?`,
						lookup.UserId, lookup.Identifier).Exec()
					if err != nil {
						return err
					}
				}
			}

			return nil
		}
	}
	return nil
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
