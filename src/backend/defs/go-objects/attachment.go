// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type Attachment struct {
	Content_type string `cql:"content_type"     json:"content_type"`
	Is_inline    bool   `cql:"is_inline"        json:"is_inline"`
	Name         string `cql:"name"             json:"name"`
	Size         int64  `cql:"size"             json:"size"`
}
