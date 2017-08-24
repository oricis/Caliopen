package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (rest *RESTfacility) GetUserTags(user_id string) (tags []*Tag, err error) {
	//TODO
	return
}

func (rest *RESTfacility) CreateTag(tag *Tag) error {
	//TODO
	return nil
}

func (rest *RESTfacility) GetTag(user_id, tag_id string) (tag *Tag, err error) {
	//TODO
	return
}

func (rest *RESTfacility) UpdateTag(tag *Tag) error {
	//TODO
	return nil
}

func (rest *RESTfacility) DeleteTag(user_id, tag_id string) error {
	//TODO
	return nil
}
