package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type TagsStorage interface {
	RetrieveUserTags(user_id string) (tags []Tag, err error)
	CreateTag(tag *Tag) error
	RetrieveTag(user_id, tag_id string) (tag Tag, err error)
	UpdateTag(tag *Tag) error
	DeleteTag(user_id, tag_id string) error
}
