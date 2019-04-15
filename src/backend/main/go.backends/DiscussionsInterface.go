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
	GetUserLookupHashes(userId UUID, kind string) (hashes []HashLookup, err error)
}

type DiscussionIndex interface {
	GetDiscussionsList(filter IndexSearch) ([]Discussion, error)
}
