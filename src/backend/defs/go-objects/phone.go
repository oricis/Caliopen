// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import "github.com/satori/go.uuid"

// contacts' phone model
type Phone struct {
	IsPrimary bool   `cql:"is_primary"  json:"is_primary"`
	Number    string `cql:"number"      json:"number"`
	PhoneId   UUID   `cql:"phone_id"    json:"phone_id"`
	Type      string `cql:"type"        json:"type"`
	Uri       string `cql:"uri"         json:"uri"` //RFC3966
}

func (p *Phone) UnmarshalMap(input map[string]interface{}) error {
	if isPrimary, ok := input["is_primary"].(bool); ok {
		p.IsPrimary = isPrimary
	}
	if number, ok := input["number"].(string); ok {
		p.Number = number
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
