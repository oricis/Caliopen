// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type DiscussionsStore struct{}

func (ds DiscussionsStore) GetDiscussion(user_id, discussion_id UUID) (*Discussion, error) {
	return nil, errors.New("test interface not implemented")
}
func (ds DiscussionsStore) GetOrCreateDiscussion(user_id UUID, participants []Participant) (*Discussion, error) {
	return nil, errors.New("test interface not implemented")
}
