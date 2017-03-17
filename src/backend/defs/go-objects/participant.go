// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type Participant struct {
	Address    string `cql:"address"          json:"address"`
	Contact_id UUID   `cql:"contact_id"       json:"contact_id"             formatter:"rfc4122"`
	Label      string `cql:"label"            json:"label"`
	Protocol   string `cql:"protocol"         json:"protocol"`
	Type       string `cql:"type"             json:"type"`
}


func (rcpt *Participant) MarshalJSON() ([]byte, error) {
	return customJSONMarshaler(rcpt, "json")
}
