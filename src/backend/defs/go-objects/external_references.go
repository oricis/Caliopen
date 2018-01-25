// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type ExternalReferences struct {
	Ancestors_ids []string `cql:"ancestors_ids"            json:"ancestors_ids,omitempty"`
	Message_id    string   `cql:"message_id"               json:"message_id,omitempty"`
	Parent_id     string   `cql:"parent_id"                json:"parent_id,omitempty"`
}

func (er *ExternalReferences) UnmarshalMap(input map[string]interface{}) error {
	er.Ancestors_ids = []string{}
	if _, ok := input["ancestors_ids"]; ok && input["ancestors_ids"] != nil {
		for _, id := range input["ancestors_ids"].([]interface{}) {
			er.Ancestors_ids = append(er.Ancestors_ids, id.(string))
		}
	}
	er.Message_id, _ = input["message_id"].(string)
	er.Parent_id, _ = input["parent_id"].(string)
	return nil //TODO: error handling
}
