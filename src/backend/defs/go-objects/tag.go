// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import "time"

type Tag struct {
	Date_insert      time.Time `cql:"date_insert"             json:"date_insert"   formatter:"rfc3339nano"`
	Importance_level int32     `cql:"importance_level"        json:"importance_level"`
	Label            string    `cql:"label"                   json:"label"`
	Name             string    `cql:"name"                    json:"name"`
	Tag_id           UUID      `cql:"tag_id"                  json:"tag_id"        formatter:"rfc4122"`
	Type             TagType   `cql:"type"                    json:"type"`
	User_id          UUID      `cql:"user_id"                 json:"user_id"       formatter:"rfc4122"`
}

type TagType string

const (
	UserTag   TagType = "user"
	SystemTag TagType = "system"
)
