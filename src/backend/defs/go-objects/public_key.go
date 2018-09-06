// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"encoding/json"
	"math/big"
	"time"
)

type PublicKey struct {
	// PRIMARY KEYS (UserId, ResourceId, KeyId)
	Algorithm       string           `cql:"alg"              json:"alg,omitempty"                                             patch:"user"`
	Curve           string           `cql:"crv"              json:"crv,omitempty"                                             patch:"user"`
	DateInsert      time.Time        `cql:"date_insert"      json:"date_insert,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	DateUpdate      time.Time        `cql:"date_update"      json:"date_update,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	ExpireDate      time.Time        `cql:"expire_date"      json:"expire_date,omitempty"         formatter:"RFC3339Milli"    patch:"user"`
	Fingerprint     []byte           `cql:"fingerprint"      json:"fingerprint,omitempty"                                     patch:"user"`
	Key             []byte           `cql:"key"              json:"key,omitempty"                                             patch:"user"`
	KeyId           UUID             `cql:"key_id"           json:"key_id"                                                    patch:"system"`
	KeyType         string           `cql:"kty"              json:"kty,omitempty"                                             patch:"user"`
	Label           string           `cql:"label"            json:"label,omitempty"                                           patch:"user"`
	ResourceId      UUID             `cql:"resource_id"      json:"resource_id"                                               patch:"system"`
	ResourceType    string           `cql:"resource_type"    json:"resource_type,omitempty"                                   patch:"system"`
	Size            int              `cql:"size"             json:"size"`
	Use             string           `cql:"use"              json:"use,omitempty"                                             patch:"user"`
	UserId          UUID             `cql:"user_id"          json:"user_id,omitempty"                                         patch:"system"`
	X               big.Int          `cql:"x"                json:"x,omitempty"                                               patch:"user"`
	Y               big.Int          `cql:"y"                json:"y,omitempty"                                               patch:"user"`
}

// unmarshal a map[string]interface{} that must owns all PublicKey's fields
// typical usage is for unmarshaling response from Cassandra backend
func (pk *PublicKey) UnmarshalCQLMap(input map[string]interface{}) {
	/*
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
		if i_pf, ok := input["privacy_features"].(map[string]string); ok && i_pf != nil {
			pf := PrivacyFeatures{}
			for k, v := range i_pf {
				pf[k] = v
			}
			pk.PrivacyFeatures = &pf
		} else {
			pk.PrivacyFeatures = nil
		}
		if size, ok := input["size"].(int); ok {
			pk.Size = size
		}
		if userid, ok := input["user_id"].(gocql.UUID); ok {
			pk.UserId.UnmarshalBinary(userid.Bytes())
		}
	*/
}

func (pk *PublicKey) UnmarshalMap(input map[string]interface{}) error {
	/*
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
		} else {
			pk.PrivacyFeatures = nil
		}
		if size, ok := input["size"].(float64); ok {
			pk.Size = int(size)
		}
		if u_id, ok := input["user_id"].(string); ok {
			if id, err := uuid.FromString(u_id); err == nil {
				pk.UserId.UnmarshalBinary(id.Bytes())
			}
		}
	*/
	return nil //TODO : errors handling
}

func (pk *PublicKey) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return pk.UnmarshalMap(input)
}

// GetTableInfos implements HasTable interface.
// It returns params needed by CassandraBackend to CRUD on PublicKey table.
func (pk *PublicKey) GetTableInfos() (table string, partitionKeys map[string]string, clusteringKeys map[string]string) {
	return "public_key",
		map[string]string{
			"UserId":     "user_id",
			"ResourceId": "resource_id",
			"KeyId":      "key_id",
		},
		map[string]string{
			"UserId":     "user_id",
			"ResourceId": "resource_id",
		}
}

func (pk *PublicKey) MarshallNew(contacts ...interface{}) {
	/*
		if len(contacts) == 1 {
			c := contacts[0].(*Contact)
			pk.UserId.UnmarshalBinary(c.UserId.Bytes())
			pk.ContactId.UnmarshalBinary(c.ContactId.Bytes())
			// do not change date if mashallNew has been called multiple time on a publickey being created
			if pk.DateInsert.IsZero() {
				pk.DateInsert = time.Now()
			}
			if pk.DateUpdate.IsZero() {
				pk.DateUpdate = pk.DateInsert
			}
		}
	*/
}

// return a JSON representation of PublicKey suitable for frontend client
func (pk *PublicKey) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", pk)
}

func (pk *PublicKey) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", pk)
}

func (pk *PublicKey) NewEmpty() interface{} {
	p := new(PublicKey)
	return p
}

/* ObjectPatchable interface */
func (pk *PublicKey) JsonTags() map[string]string {
	return jsonTags(pk)
}

func (pk *PublicKey) SortSlices() {
	// nothing to sort
}

type PublicKeys []PublicKey

// Sort interface implementation
type ByKeyId PublicKeys

func (p ByKeyId) Len() int {
	return len(p)
}

func (p ByKeyId) Less(i, j int) bool {
	return p[i].KeyId.String() < p[j].KeyId.String()
}

func (p ByKeyId) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
