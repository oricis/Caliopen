// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/satori/go.uuid"
)

// contacts' phone model
type Phone struct {
	IsPrimary        bool   `cql:"is_primary"           json:"is_primary,omitempty"                                       patch:"user"`
	NormalizedNumber string `cql:"normalized_number"    json:"normalized_number,omitempty"                                patch:"user"`
	Number           string `cql:"number"               json:"number,omitempty"           cql_lookup:"contact_lookup"     patch:"user"`
	PhoneId          UUID   `cql:"phone_id"             json:"phone_id,omitempty"                                         patch:"system"`
	Type             string `cql:"type"                 json:"type,omitempty"                                             patch:"user"`
	Uri              string `cql:"uri"                  json:"uri,omitempty"                                              patch:"system"` //RFC3966
}

func (p *Phone) UnmarshalMap(input map[string]interface{}) error {
	if isPrimary, ok := input["is_primary"].(bool); ok {
		p.IsPrimary = isPrimary
	}
	if number, ok := input["number"].(string); ok {
		p.Number = number
	}
	if number, ok := input["normalized_number"].(string); ok {
		p.NormalizedNumber = number
	}
	if p_id, ok := input["phone_id"].(string); ok {
		if id, err := uuid.FromString(p_id); err == nil {
			p.PhoneId.UnmarshalBinary(id.Bytes())
		}
	}
	if t, ok := input["type"].(string); ok {
		p.Type = t
	}
	if uri, ok := input["uri"].(string); ok {
		p.Uri = uri
	}
	return nil //TODO : errors handling
}

// MarshallNew must be a variadic func to implement NewMarshaller interface,
// but Phone does not need params to marshal a well-formed Phone: ...interface{} is ignored
func (p *Phone) MarshallNew(...interface{}) {
	nullID := new(UUID)
	if len(p.PhoneId) == 0 || (bytes.Equal(p.PhoneId.Bytes(), nullID.Bytes())) {
		p.PhoneId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

func (p *Phone) JsonTags() map[string]string {
	return jsonTags(p)
}

func (p *Phone) NewEmpty() interface{} {
	return new(Phone)
}

func (p *Phone) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return p.UnmarshalMap(input)
}

// Sort interface implementation
type ByPhoneID []Phone

func (p ByPhoneID) Len() int {
	return len(p)
}

func (p ByPhoneID) Less(i, j int) bool {
	return p[i].PhoneId.String() < p[j].PhoneId.String()
}

func (p ByPhoneID) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
