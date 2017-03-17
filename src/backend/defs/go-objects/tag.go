// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type Tag struct {
	Name    string  `cql:"name"        json:"name"`
	Type    TagType `cql:"type"        json:"type"`
	Tag_id  UUID    `cql:"tag_id"      json:"tag_id"        formatter:"rfc4122"`
	User_id UUID    `cql:"user_id"     json:"user_id"       formatter:"rfc4122"`
}

type TagType string

const (
	UserTag   TagType = "user"
	SystemTag TagType = "system"
)
