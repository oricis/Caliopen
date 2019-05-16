// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"sort"
	"strings"
	"time"
)

type (
	Participant struct {
		Address     string `cql:"address"          json:"address,omitempty"`
		Contact_ids []UUID `cql:"contact_ids"      json:"contact_ids,omitempty"             formatter:"rfc4122"`
		Label       string `cql:"label"            json:"label,omitempty"`
		Protocol    string `cql:"protocol"         json:"protocol,omitempty"`
		Type        string `cql:"type"             json:"type,omitempty"`
	}

	HashLookup struct {
		UserId         UUID      `cql:"user_id"` // primary key
		Uri            string    `cql:"uri"`     // primary key
		Hash           string    `cql:"hash"`    // primary key
		DateInsert     time.Time `cql:"date_insert"`
		HashComponents []string  `cql:"hash_components"`
	}

	ParticipantHash struct {
		UserId     UUID      `cql:"user_id"` // primary key
		Kind       string    `cql:"kind"`    // primary key
		Key        string    `cql:"key"`     // primary key
		Value      string    `cql:"value"`   // primary key
		Components []string  `cql:"components"`
		DateInsert time.Time `cql:"date_insert"`
	}
)

func (p *Participant) UnmarshalMap(input map[string]interface{}) error {
	if address, ok := input["address"].(string); ok {
		p.Address = address
	}
	if label, ok := input["label"].(string); ok {
		p.Label = label
	}
	if protocol, ok := input["protocol"].(string); ok {
		p.Protocol = protocol
	}
	if t, ok := input["type"].(string); ok {
		p.Type = t
	}
	if contact_ids, ok := input["contact_ids"]; ok && contact_ids != nil {
		p.Contact_ids = []UUID{}
		for _, contact_id := range contact_ids.([]interface{}) {
			c_id := contact_id.(string)
			var contact_uuid UUID
			if id, err := uuid.FromString(c_id); err == nil {
				contact_uuid.UnmarshalBinary(id.Bytes())
			}
			p.Contact_ids = append(p.Contact_ids, contact_uuid)
		}
	}
	return nil //TODO: errors handling
}

func (pl *HashLookup) UnmarshalCQLMap(input map[string]interface{}) error {
	if user_id, ok := input["user_id"].(gocql.UUID); ok {
		pl.UserId.UnmarshalBinary(user_id.Bytes())
	}
	if uri, ok := input["uri"].(string); ok {
		pl.Uri = uri
	}
	if hash, ok := input["hash"].(string); ok {
		pl.Hash = hash
	}
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		pl.DateInsert = dateInsert
	}
	if components, ok := input["hash_components"].([]string); ok {
		pl.HashComponents = components
	}
	return nil
}

// part of CaliopenObject interface
func (p *Participant) MarshallNew(...interface{}) {
	// nothing to enforce
}

func (pl *HashLookup) MarshallNew(args ...interface{}) {
	if len(pl.UserId) == 0 || (bytes.Equal(pl.UserId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				pl.UserId = args[0].(UUID)
			}
		}
	}
	pl.HashComponents = []string{}
}

func (hl *ParticipantHash) UnmarshalCQLMap(input map[string]interface{}) error {
	if user_id, ok := input["user_id"].(gocql.UUID); ok {
		hl.UserId.UnmarshalBinary(user_id.Bytes())
	}
	if kind, ok := input["kind"].(string); ok {
		hl.Kind = kind
	}
	if key, ok := input["key"].(string); ok {
		hl.Key = key
	}
	if value, ok := input["value"].(string); ok {
		hl.Value = value
	}
	if components, ok := input["components"].([]string); ok {
		hl.Components = components
	}
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		hl.DateInsert = dateInsert
	}
	return nil
}

// Sort interface implementation
type ByAddress []Participant

func (p ByAddress) Len() int {
	return len(p)
}

func (p ByAddress) Less(i, j int) bool {
	return p[i].Address < p[j].Address
}

func (p ByAddress) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

// HashFromParticipatnsUris creates a hash from a collection of Participant
func HashFromParticipantsUris(participants []Participant) (hash string, components []string, err error) {
	urisMap := map[string]struct{}{}
	for _, participant := range participants {
		uri := participant.Protocol + ":" + strings.ToLower(participant.Address)
		urisMap[uri] = struct{}{}
	}
	components = []string{}
	for k, _ := range urisMap {
		components = append(components, k)
	}
	hash = HashComponents(components)
	return
}

// ComputeNewParticipantHash computes a new participants_hash and update participants components
// based on new uri->participant relation provided in params
// if associate == true, uri will be replaced by contactId
// else, uri must be dissociated from contactId
func ComputeNewParticipantHash(uri, contactId string, current ParticipantHash, urisComponents []string, associate bool) (new ParticipantHash, err error) {
	logrus.Infoln("ComputeNewParticipantHash called")
	logrus.Infoln(uri)
	logrus.Infoln(contactId)
	logrus.Infof("%+v", current)
	logrus.Infoln(urisComponents)
	logrus.Infoln(associate)
	new.UserId = current.UserId
	new.Kind = "participants"
	participantsMap := map[string]struct{}{}
	if associate {
		// replace uri by contactId
		for _, component := range current.Components {
			if component == uri {
				participantsMap["contact:"+contactId] = struct{}{}
			} else {
				participantsMap[component] = struct{}{}
			}
		}
	} else {
		// re-add uri to participantsMap
		for _, component := range current.Components {
			if component == "contact:"+contactId {
				// add uri to components
				participantsMap[uri] = struct{}{}
			} else {
				participantsMap[component] = struct{}{}
			}
		}
		// if contactId is linked to another uri, it must be kept in participants
		for _, uriComponent := range urisComponents {
			if _, ok := participantsMap[uriComponent]; !ok && uriComponent != uri {
				participantsMap["contact:"+contactId] = struct{}{}
			}
		}
	}
	// compute new hash
	components := []string{}
	for k, _ := range participantsMap {
		components = append(components, k)
	}
	// embed new components slice
	new.Key = HashComponents(components)
	new.Components = components
	new.Value = current.Value
	logrus.Infof("new : %+v", new)
	return
}

func HashComponents(c []string) string {
	sort.Strings(c)
	sum := sha256.Sum256([]byte(strings.Join(c, "")))
	return fmt.Sprintf("%x", sum)
}

// StoreURIsParticipantsBijection stores uris_hash <-> participants_hash bijection
// in participant_hash table
func StoreURIsParticipantsBijection(session *gocql.Session, userId, uriHash, participantHash string, uriComponents, participantComponents []string) error {
	now := time.Now()
	// store uris_hash -> participants_hash
	e1 := session.Query(`INSERT INTO participant_hash (user_id, kind, key, value, components, date_insert) VALUES (?,?,?,?,?,?)`,
		userId, UrisKind, uriHash, participantHash, uriComponents, now).Exec()

	// store participants_hash -> uris_hash
	e2 := session.Query(`INSERT INTO participant_hash (user_id, kind, key, value, components, date_insert) VALUES (?,?,?,?,?,?)`,
		userId, ParticipantsKind, participantHash, uriHash, participantComponents, now).Exec()
	switch {
	case e1 != nil:
		return e1
	case e2 != nil:
		return e2
	}
	return nil
}

// RemoveURIsParticipantsBijection delete uris_hash <-> participants_hash bijection
// in participant_hash table
func RemoveURIsParticipantsBijection(session *gocql.Session, former ParticipantHash) error {
	var first, second string
	first = former.Kind
	if first == ParticipantsKind {
		second = UrisKind
	} else {
		second = ParticipantsKind
	}
	e1 := session.Query(`DELETE FROM participant_hash WHERE user_id = ? AND kind = ? AND key = ? AND value = ?`,
		former.UserId,
		first,
		former.Key,
		former.Value).Exec()
	e2 := session.Query(`DELETE FROM participant_hash WHERE user_id = ? AND kind = ? AND key = ? AND value = ?`,
		former.UserId,
		second,
		former.Value,
		former.Key).Exec()
	switch {
	case e1 != nil:
		return e1
	case e2 != nil:
		return e2
	}
	return nil
}
