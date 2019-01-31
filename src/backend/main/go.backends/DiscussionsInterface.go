/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type DiscussionStorage interface {
	GetDiscussion(user_id, discussion_id UUID) (*Discussion, error)
	GetOrCreateDiscussion(user_id UUID, participants []Participant) (*Discussion, error)
}
