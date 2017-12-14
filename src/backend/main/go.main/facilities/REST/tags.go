package REST

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/bitly/go-simplejson"
	"github.com/pkg/errors"
)

func (rest *RESTfacility) RetrieveUserTags(user_id string) (tags []Tag, err error) {
	return rest.store.RetrieveUserTags(user_id)
}

// CreateTag :
// - adds the tag in db for user if it doesn't exist yet
// - modifies tag in-place to add the tag_id returned by store
func (rest *RESTfacility) CreateTag(tag *Tag) error {
	return rest.store.CreateTag(tag)
}

func (rest *RESTfacility) RetrieveTag(user_id, tag_id string) (tag Tag, err error) {
	return rest.store.RetrieveTag(user_id, tag_id)
}

// PatchTag is a shortcut for REST api to call two methods :
// - UpdateWithPatch () to retrieve the tag and update it
// - then UpdateTag() to save updated tag to stores if everything went good.
func (rest *RESTfacility) PatchTag(patch []byte, user_id, tag_id string) error {

	current_tag, err := rest.RetrieveTag(user_id, tag_id)
	if err != nil {
		return err
	}

	err = helpers.UpdateWithPatch(&current_tag, patch, UserActor)
	if err != nil {
		return err
	}

	return rest.UpdateTag(&current_tag)

}

// UpdateTag updates a tag in store with payload,
// only if tag is a user tag.
func (rest *RESTfacility) UpdateTag(tag *Tag) error {
	user_id := tag.User_id.String()
	tag_id := tag.Tag_id.String()
	if user_id != "" && tag_id != "" {

		db_tag, err := rest.store.RetrieveTag(user_id, tag_id)
		if err != nil {
			return err
		}
		if db_tag.Type == SystemTag {
			return errors.New("system tags can't be updated by user")
		}
		// RESTfacility allows user to only modify the name attribute
		tag.Date_insert = db_tag.Date_insert
		tag.Importance_level = db_tag.Importance_level
		return rest.store.UpdateTag(tag)

	} else {
		return errors.New("invalid tag's tag_id and/or user_id")
	}
}

// DeleteTag deletes a tag in store,
// only if tag is a user tag.
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

// UpdateResourceTags :
// - checks that tag_ids within patch belong to user and are unique,
// - calls generic UpdateWithPatch func to patch the resource,
// - saves and indexes updated resource.
// It is caller responsibility to call this func with a well-formed patch that has only "tags" properties
func (rest *RESTfacility) UpdateResourceTags(userID, resourceID, resourceType string, patch []byte) error {
	var err error
	// 1. check that tag_ids within patch belong to user and are unique
	tags, err := rest.RetrieveUserTags(userID)
	if err != nil {
		return err
	}
	userTagsMap := make(map[string]bool)
	for _, tag := range tags {
		userTagsMap[tag.Tag_id.String()] = true
	}

	p, err := simplejson.NewJson(patch)
	if err != nil {
		return err
	}
	deduplicatedTagsList := []string{}
	patchTagsMap := make(map[string]bool)
	for _, tag := range p.Get("tags").MustStringArray() {
		// is tag belonging to user ?
		if _, ok := userTagsMap[tag]; !ok {
			err = fmt.Errorf("[RESTfacility] UpdateResourceTags : tag with id <%s> does not belong to user <%s>", tag, userID)
			break
		}
		// is tag unique ?
		if _, ok := patchTagsMap[tag]; !ok {

			patchTagsMap[tag] = true
			deduplicatedTagsList = append(deduplicatedTagsList, tag)
		}
	}

	p.Set("tags", deduplicatedTagsList)

	if err != nil {
		return err
	}
	patch, _ = p.MarshalJSON()
	// 2. call generic UpdateWitchPatch func
	var obj CaliopenObject

	switch resourceType {
	case MessageType:
		m, err := rest.store.RetrieveMessage(userID, resourceID)
		if err != nil {
			return err
		}
		obj = CaliopenObject(m)
	case ContactType:
		c, err := rest.store.GetContact(userID, resourceID)
		if err != nil {
			return err
		}
		obj = CaliopenObject(c)
	default:
		return errors.New("[RESTfacility] UpdateResourceWithPatch : invalid resourceType")
	}
	err = helpers.UpdateWithPatch(obj, patch, UserActor)
	if err != nil {
		return err
	}

	// 3. store and index updated resource

	switch resourceType {
	case MessageType:
		update := map[string]interface{}{
			"tags": obj.(*Message).Tags,
		}
		err := rest.store.UpdateMessage(obj.(*Message), update)
		if err != nil {
			return err
		}

		err = rest.index.UpdateMessage(obj.(*Message), update)
		if err != nil {
			return err
		}
	}

	return nil
}
