// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type TagsStore struct{}

func (ts TagsStore) RetrieveUserTags(user_id string) (tags []Tag, err error) {
	return nil, errors.New("test interface not implemented")
}

func (ts TagsStore) CreateTag(tag *Tag) error {
	return errors.New("test interface not implemented")
}

func (ts TagsStore) RetrieveTag(user_id, tag_id string) (tag Tag, err error) {
	return Tag{}, errors.New("test interface not implemented")
}

func (ts TagsStore) UpdateTag(tag *Tag) error {
	return errors.New("test interface not implemented")
}

func (ts TagsStore) DeleteTag(user_id, tag_id string) error {
	return errors.New("test interface not implemented")
}
