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
	Deleted        bool   `cql:"deleted"            json:"deleted"              patch:"system"`
	Department     string `cql:"department"         json:"department,omitempty"           patch:"user"`
	IsPrimary      bool   `cql:"is_primary"         json:"is_primary"           patch:"user"`
	JobDescription string `cql:"job_description"    json:"job_description,omitempty"      patch:"user"`
	Label          string `cql:"label"              json:"label,omitempty"                patch:"user"`
	Name           string `cql:"name"               json:"name,omitempty"                 patch:"user"`
	OrganizationId UUID   `cql:"organization_id"    json:"organization_id,omitempty"      patch:"system"`
	Title          string `cql:"title"              json:"title,omitempty"                patch:"user"`
	Type           string `cql:"type"               json:"type,omitempty"                 patch:"user"`
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

// MarshallNew must be a variadic func to implement NewMarshaller interface,
// but Organization does not need params to marshal a well-formed Organization: ...interface{} is ignored
func (o *Organization) MarshallNew(...interface{}) {
	nullID := new(UUID)
	if len(o.OrganizationId) == 0 || (bytes.Equal(o.OrganizationId.Bytes(), nullID.Bytes())) {
		o.OrganizationId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

// Sort interface implementation
type ByOrganizationID []Organization

func (p ByOrganizationID) Len() int {
	return len(p)
}

func (p ByOrganizationID) Less(i, j int) bool {
	return p[i].OrganizationId.String() < p[j].OrganizationId.String()
}

func (p ByOrganizationID) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
