// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

// contacts' organization model
type Organization struct {
	Deleted        bool   `cql:"deleted"            json:"deleted"`
	Department     string `cql:"department"         json:"department"`
	IsPrimary      bool   `cql:"is_primary"         json:"is_primary"`
	JobDescription string `cql:"job_description"    json:"job_description"`
	Label          string `cql:"label"              json:"label"`
	Name           string `cql:"name"               json:"name"`
	OrganizationId UUID   `cql:"organization_id"    json:"organization_id"`
	Title          string `cql:"titel"              json:"title"`
	Type           string `cql:"type"               json:"type"`
}
