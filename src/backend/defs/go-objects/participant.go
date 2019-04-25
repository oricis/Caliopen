// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
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
