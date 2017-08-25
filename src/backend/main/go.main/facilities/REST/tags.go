package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/pkg/errors"
)

func (rest *RESTfacility) RetrieveUserTags(user_id string) (tags []Tag, err error) {
	return rest.store.RetrieveUserTags(user_id)
}

// add the tag in db for user if it doesn't exist yet
// modify tag in-place to add its generated tag_id for future retrieval
func (rest *RESTfacility) CreateTag(tag *Tag) error {
	return rest.store.CreateTag(tag)
}

func (rest *RESTfacility) RetrieveTag(user_id, tag_id string) (tag Tag, err error) {
	return rest.store.RetrieveTag(user_id, tag_id)
}

func (rest *RESTfacility) UpdateTag(tag *Tag) error {
	//not yet implemented
	return nil
}

func (rest *RESTfacility) DeleteTag(user_id, tag_id string) error {

	tag, err := rest.store.RetrieveTag(user_id, tag_id)
	if err != nil {
		return err
	}
	if tag.Type == SystemTag {
		return errors.New("system tags can't be deleted by user")
	}

	return rest.store.DeleteTag(user_id, tag_id)
}
