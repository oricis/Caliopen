// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

// contact's instant messaging address model
type IM struct {
	Address   string `cql:"address"     json:"address"`
	IMId      UUID   `cql:"im_id"       json:"im_id"`
	IsPrimary bool   `cql:"is_primary"  json:"is_primary"`
	Label     string `cql:"label"       json:"label"`
	Protocol  string `cql:"protocol"    json:"protocol"`
	Type      string `cql:"type"        json:"type"`
}
