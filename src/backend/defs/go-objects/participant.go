// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"github.com/satori/go.uuid"
)

type Participant struct {
	Address     string `cql:"address"          json:"address"`
	Contact_ids []UUID `cql:"contact_ids"      json:"contact_ids"             formatter:"rfc4122"`
	Label       string `cql:"label"            json:"label"`
	Protocol    string `cql:"protocol"         json:"protocol"`
	Type        string `cql:"type"             json:"type"`
}

/*
func (rcpt *Participant) MarshalJSON() ([]byte, error) {
	return customJSONMarshaler(rcpt, "json")
}
*/

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
