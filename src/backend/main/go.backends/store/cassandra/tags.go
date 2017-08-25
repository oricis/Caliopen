package store

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocql/gocql"
	"time"
)

// retrieve tags of type 'user' belonging to user_id
func (cb *CassandraBackend) RetrieveUserTags(user_id string) (tags []Tag, err error) {
	all_tags, err := cb.Session.Query(`SELECT * FROM user_tag WHERE user_id = ?`, user_id).Iter().SliceMap()
	if err != nil {
		return
	}
	if len(all_tags) == 0 {
		err = errors.New("[cassandra] : user tags lookup returns empty")
		return
	}
	for _, tag := range all_tags {
		t := Tag{
			Date_insert:      tag["date_insert"].(time.Time),
			Importance_level: int32(tag["importance_level"].(int)),
			Name:             tag["name"].(string),
			Type:             TagType(tag["type"].(string)),
		}
		t.Tag_id.UnmarshalBinary(tag["tag_id"].(gocql.UUID).Bytes())
		t.User_id.UnmarshalBinary(tag["user_id"].(gocql.UUID).Bytes())
		tags = append(tags, t)
	}
	return
}
func (cb *CassandraBackend) CreateTag(tag *Tag) error {
	//TODO
	return nil
}
func (cb *CassandraBackend) RetrieveTag(user_id, tag_id string) (tag Tag, err error) {
	//TODO
	return Tag{
		Date_insert:      time.Now(),
		Importance_level: 12,
		Name:             "tag_name",
		Tag_id:           UUID{},
		Type:             TagType("tag_type"),
		User_id:          UUID{},
	}, nil
}
func (cb *CassandraBackend) UpdateTag(tag *Tag) error {
	//not yet implemented
	return nil
}
func (cb *CassandraBackend) DeleteTag(user_id, tag_id string) error {
	//TODO
	return nil
}
