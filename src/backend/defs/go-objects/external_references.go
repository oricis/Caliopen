// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type ExternalReferences struct {
	Discussion_id string `cql:"discussion_id"            json:"discussion_id"`
	Message_id    string `cql:"message_id"               json:"message_id"`
	Parent_id     string `cql:"parent_id"                json:"parent_id"`
}
