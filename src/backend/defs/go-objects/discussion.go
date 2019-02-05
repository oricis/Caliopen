// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"time"
)

type (
	Discussion struct {
		UserId           UUID      `cql:"user_id"`
		Date_insert      time.Time `cql:"date_insert"              json:"date_insert"              formatter:"RFC3339Milli"`
		Discussion_id    UUID      `cql:"discussion_id"            json:"discussion_id"            formatter:"rfc4122"`
		Importance_level int32     `cql:"importance_level"         json:"importance_level"`
		Excerpt          string    `cql:"excerpt"                  json:"excerpt"`
		Total_count      int32     `cql:"-"              json:"total_count"`
		Unread_count     int32     `cql:"-"             json:"unread_count"`
	}

	DiscussionGlobalLookup struct {
		UserId       UUID   `cql:"user_id"`
		Hashed       string `cql:"hashed"`
		DiscussionId UUID   `cql:"discussion_id"`
	}
)

// MarshallNew implements CaliopenObject interface
func (d *Discussion) MarshallNew(args ...interface{}) {
	if len(d.Discussion_id) == 0 || (bytes.Equal(d.Discussion_id.Bytes(), EmptyUUID.Bytes())) {
		d.Discussion_id.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if len(d.UserId) == 0 || (bytes.Equal(d.UserId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				d.UserId = args[0].(UUID)
			}
		}
	}

	if d.Date_insert.IsZero() {
		d.Date_insert = time.Now()
	}
}

func (d *Discussion) UnmarshalCQLMap(input map[string]interface{}) error {
	if user_id, ok := input["user_id"].(gocql.UUID); ok {
		d.UserId.UnmarshalBinary(user_id.Bytes())
	}
	if discussion_id, ok := input["discussion_id"].(gocql.UUID); ok {
		d.Discussion_id.UnmarshalBinary(discussion_id.Bytes())
	}
	if date_insert, ok := input["date_insert"].(time.Time); ok {
		d.Date_insert = date_insert
	}
	return nil
}

func (d *DiscussionGlobalLookup) UnmarshalCQLMap(input map[string]interface{}) error {
	if user_id, ok := input["user_id"].(gocql.UUID); ok {
		d.UserId.UnmarshalBinary(user_id.Bytes())
	}
	if hash, ok := input["hashed"].(string); ok {
		d.Hashed = hash
	}
	if did, ok := input["discussion_id"].(gocql.UUID); ok {
		d.DiscussionId.UnmarshalBinary(did.Bytes())
	}
	return nil
}
