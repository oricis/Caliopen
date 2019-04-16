// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (cb *CassandraBackend) GetUserLookupHashes(userId UUID, kind, key string) (hashes []HashLookup, err error) {
	var rawHashes []map[string]interface{}
	if key != "" {
		rawHashes, err = cb.SessionQuery(`SELECT * from hash_lookup WHERE user_id = ? AND kind = ? AND key = ?`, userId, kind, key).Iter().SliceMap()
	} else {
		rawHashes, err = cb.SessionQuery(`SELECT * from hash_lookup WHERE user_id = ? AND kind = ?`, userId, kind).Iter().SliceMap()
	}
	if err != nil {
		return
	}
	if len(rawHashes) == 0 {
		err = errors.New("not found")
		return
	}
	for _, hash := range rawHashes {
		h := new(HashLookup)
		h.UnmarshalCQLMap(hash)
		hashes = append(hashes, *h)
	}
	return
}

func (cb *CassandraBackend) RetrieveLookupHash(userId UUID, kind, hash string) (lookup HashLookup, err error) {
	m := map[string]interface{}{}
	q := cb.SessionQuery(`SELECT * from hash_lookup WHERE user_id = ? AND kind = ? AND key = ?`, userId, kind, hash)
	err = q.MapScan(m)
	if err != nil {
		return
	}
	lookup.UnmarshalCQLMap(m)
	return
}

// CreateThreadLookup inserts a new entry into discussion_thread_lookup table
func (cb *CassandraBackend) CreateThreadLookup(user_id, discussion_id UUID, external_msg_id string) error {
	return cb.SessionQuery(`INSERT INTO discussion_thread_lookup (user_id, external_root_msg_id, discussion_id) VALUES (?,?,?)`,
		user_id.String(),
		external_msg_id,
		discussion_id.String()).Exec()
}
