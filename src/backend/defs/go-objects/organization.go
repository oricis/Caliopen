// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"github.com/satori/go.uuid"
)

// contacts' organization model
type Organization struct {
	Deleted        bool   `cql:"deleted"            json:"deleted"`
	Department     string `cql:"department"         json:"department"`
	IsPrimary      bool   `cql:"is_primary"         json:"is_primary"`
	JobDescription string `cql:"job_description"    json:"job_description"`
	Label          string `cql:"label"              json:"label"`
	Name           string `cql:"name"               json:"name"`
	OrganizationId UUID   `cql:"organization_id"    json:"organization_id"`
	Title          string `cql:"title"              json:"title"`
	Type           string `cql:"type"               json:"type"`
}

func (o *Organization) UnmarshalMap(input map[string]interface{}) error {
	if deleted, ok := input["deleted"].(bool); ok {
		o.Deleted = deleted
	}
	if department, ok := input["department"].(string); ok {
		o.Department = department
	}
	if isPrimary, ok := input["is_primary"].(bool); ok {
		o.IsPrimary = isPrimary
	}
	if jobDescription, ok := input["job_description"].(string); ok {
		o.JobDescription = jobDescription
	}
	if label, ok := input["label"].(string); ok {
		o.Label = label
	}
	if name, ok := input["name"].(string); ok {
		o.Name = name
	}
	if o_id, ok := input["organization_id"].(string); ok {
		if id, err := uuid.FromString(o_id); err == nil {
			o.OrganizationId.UnmarshalBinary(id.Bytes())
		}
	}
	if title, ok := input["title"].(string); ok {
		o.Title = title
	}
	if t, ok := input["type"].(string); ok {
		o.Title = t
	}
	return nil //TODO: errors handling
}

func (o *Organization) MarshallNew() {
	nullID := new(UUID)
	if len(o.OrganizationId) == 0 || (bytes.Equal(o.OrganizationId.Bytes(), nullID.Bytes())) {
		o.OrganizationId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}
