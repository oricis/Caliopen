// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type (
	LocalIdentity struct {
		Display_name string   `cql:"display_name"            json:"display_name"`
		Identifier   string   `cql:"identifier"              json:"identifier"`
		Status       string   `cql:"status"                  json:"status"`
		Type         []string `cql:"type"                    json:"type"`
		UserId       UUID     `cql:"user_id"                 json:"user_id"           formatter:"rfc4122"`
	}
)
