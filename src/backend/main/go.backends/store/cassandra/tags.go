package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"time"
)

func (cb *CassandraBackend) RetrieveUserTags(user_id string) (tags []Tag, err error) {
	//TODO
	tags = []Tag{
		{
			Date_insert:      time.Now(),
			Importance_level: 12,
			Name:             "tag_name",
			Tag_id:           UUID{},
			Type:             TagType("tag_type"),
			User_id:          UUID{},
		},
		{
			Date_insert:      time.Now(),
			Importance_level: 12,
			Name:             "tag_name",
			Tag_id:           UUID{},
			Type:             TagType("tag_type"),
			User_id:          UUID{},
		},
		{
			Date_insert:      time.Now(),
			Importance_level: 12,
			Name:             "tag_name",
			Tag_id:           UUID{},
			Type:             TagType("tag_type"),
			User_id:          UUID{},
		},
		{
			Date_insert:      time.Now(),
			Importance_level: 12,
			Name:             "tag_name",
			Tag_id:           UUID{},
			Type:             TagType("tag_type"),
			User_id:          UUID{},
		},
	}
	return
}
func (cb *CassandraBackend) CreateTag(tag *Tag) error {
	//TODO
	(*tag).Date_insert = time.Now()
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
