// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"time"
)

type PublicKey struct {
	ContactId       UUID             `cql:"contact_id"       json:"contact_id"`
	DateInsert      time.Time        `cql:"date_insert"      json:"date_insert"`
	DateUpdate      time.Time        `cql:"date_update"      json:"date_update"`
	ExpireDate      time.Time        `cql:"expire_date"      json:"expire_date"`
	Fingerprint     string           `cql:"fingerprint"      json:"fingerprint"`
	Key             string           `cql:"key"              json:"key"`
	Name            string           `cql:"name"             json:"name"`
	PrivacyFeatures *PrivacyFeatures `cql:"privacy_features" json:"privacy_features"`
	Size            int              `cql:"size"             json:"size"`
	UserId          UUID             `cql:"user_id"          json:"user_id"`
}

// unmarshal a map[string]interface{} that must owns all PublicKey's fields
// typical usage is for unmarshaling response from Cassandra backend
func (pk *PublicKey) UnmarshalCQLMap(input map[string]interface{}) {
	if contactId, ok := input["contact_id"].(gocql.UUID); ok {
		pk.ContactId.UnmarshalBinary(contactId.Bytes())
	}
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		pk.DateInsert = dateInsert
	}
	if dateUpdate, ok := input["date_update"].(time.Time); ok {
		pk.DateUpdate = dateUpdate
	}
	if expireDate, ok := input["expire_date"].(time.Time); ok {
		pk.ExpireDate = expireDate
	}
	if fingerprint, ok := input["fingerprint"].(string); ok {
		pk.Fingerprint = fingerprint
	}
	if key, ok := input["key"].(string); ok {
		pk.Key = key
	}
	if name, ok := input["name"].(string); ok {
		pk.Name = name
	}
	if i_pf, ok := input["privacy_features"].(map[string]string); ok {
		pf := PrivacyFeatures{}
		for k, v := range i_pf {
			pf[k] = v
		}
		pk.PrivacyFeatures = &pf

	}
	if size, ok := input["size"].(int); ok {
		pk.Size = size
	}
	if userid, ok := input["user_id"].(gocql.UUID); ok {
		pk.UserId.UnmarshalBinary(userid.Bytes())
	}
}

func (pk *PublicKey) UnmarshalMap(input map[string]interface{}) error {
	if contact_id, ok := input["contact_id"].(string); ok {
		if id, err := uuid.FromString(contact_id); err == nil {
			pk.ContactId.UnmarshalBinary(id.Bytes())
		}
	}
	if date, ok := input["date_insert"]; ok {
		pk.DateInsert, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["date_update"]; ok {
		pk.DateUpdate, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["expire_date"]; ok {
		pk.ExpireDate, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if fingerprint, ok := input["fingerprint"].(string); ok {
		pk.Fingerprint = fingerprint
	}
	if key, ok := input["key"].(string); ok {
		pk.Key = key
	}
	if name, ok := input["name"].(string); ok {
		pk.Name = name
	}
	if pf, ok := input["privacy_features"]; ok && pf != nil {
		PF := &PrivacyFeatures{}
		PF.UnmarshalMap(pf.(map[string]interface{}))
		pk.PrivacyFeatures = PF
	}
	if size, ok := input["size"].(float64); ok {
		pk.Size = int(size)
	}
	if u_id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(u_id); err == nil {
			pk.UserId.UnmarshalBinary(id.Bytes())
		}
	}

	return nil //TODO : errors handling
}

// GetTableInfos implements HasTable interface.
// It returns params needed by CassandraBackend to CRUD on PublicKey table.
func (pk *PublicKey) GetTableInfos() (table string, partitionKeys []string) {
	return "public_key", []string{"user_id", "contact_id", "name"}
}

func (pk *PublicKey) MarshallNew(contacts ...interface{}) {
	if len(contacts) == 1 {
		c := contacts[0].(*Contact)
		pk.UserId.UnmarshalBinary(c.UserId.Bytes())
		pk.ContactId.UnmarshalBinary(c.ContactId.Bytes())
		pk.DateInsert = time.Now()
		pk.DateUpdate = pk.DateInsert
	}
}
