// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
	"sort"
	"strings"
)

// CreateDiscussion create a new discussion
func (cb *CassandraBackend) CreateDiscussion(discussion Discussion) error {
	discussionT := cb.IKeyspace.Table("discussion", &Discussion{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "discussion_id"},
	}).WithOptions(gocassa.Options{TableName: "discussion"})

	// save discussion
	err := discussionT.Set(discussion).Run()
	if err != nil {
		return fmt.Errorf("[CassandraBackend] CreateDiscussion: %s", err)
	}
	return nil
}

func (cb *CassandraBackend) GetDiscussion(user_id, discussion_id UUID) (discussion *Discussion, err error) {
	discussion = new(Discussion)
	m := map[string]interface{}{}
	q := cb.SessionQuery(`SELECT * FROM discussion WHERE user_id = ? AND discussion_id = ?`, user_id, discussion_id)
	err = q.MapScan(m)
	if err != nil {
		return nil, err
	}
	discussion.UnmarshalCQLMap(m)
	return
}

// CreateThreadLookup inserts a new entry into discussion_thread_lookup table
func (cb *CassandraBackend) CreateThreadLookup(user_id, discussion_id UUID, external_msg_id string) error {
	return cb.SessionQuery(`INSERT INTO discussion_thread_lookup (user_id, external_root_msg_id, discussion_id) VALUES (?,?,?)`,
		user_id.String(),
		external_msg_id,
		discussion_id.String()).Exec()
}

func (cb *CassandraBackend) CreateDiscussionGlobalLookup(user_id UUID, hash string, discussion_id UUID) error {
	return cb.SessionQuery(`INSERT INTO discussion_global_lookup (user_id, hashed, discussion_id) VALUES (?,?,?)`,
		user_id.String(),
		hash,
		discussion_id.String()).Exec()
}

func (cb *CassandraBackend) GetDiscussionGlobalLookup(user_id UUID, hash string) (lookup *DiscussionGlobalLookup, err error) {
	lookup = new(DiscussionGlobalLookup)
	m := map[string]interface{}{}
	q := cb.SessionQuery(`SELECT * FROM discussion_global_lookup WHERE user_id = ? AND hashed = ?`, user_id, hash)
	err = q.MapScan(m)
	if err != nil {
		return nil, err
	}
	lookup.UnmarshalCQLMap(m)
	return
}

// GetDiscussionByParticipants retrieve the hash value related to a list of participants used for discussion lookup
// golang version of python NewMessage.hash_participants function
func (cb *CassandraBackend) GetDiscussionHashByParticipants(user_id UUID, participants []Participant) (string, error) {
	set := make(map[string]struct{})
	parts := make([]string, len(participants))
	for _, participant := range participants {
		var to_add string
		if len(participant.Contact_ids) > 0 {
			to_add = participant.Contact_ids[0].String()
		} else {
			to_add = strings.ToLower(participant.Address)
		}
		if _, ok := set[to_add]; !ok {
			set[to_add] = struct{}{}
			parts = append(parts, to_add)
		}
	}
	sort.Strings(parts)
	h := sha256.New()
	h.Write([]byte(strings.Join(parts, "")))
	hash := hex.EncodeToString(h.Sum(nil))
	log.Info("Computed hash for parts ", parts, " is ", hash)
	return hash, nil
}

// GetOrCreateDiscussion will get an existing discussion for the list of given participants or create a new one
func (cb *CassandraBackend) GetOrCreateDiscussion(user_id UUID, participants []Participant) (discussion *Discussion, err error) {
	discussion = new(Discussion)
	hash, err := cb.GetDiscussionHashByParticipants(user_id, participants)
	if err != nil {
		return
	}
	lookup, err := cb.GetDiscussionGlobalLookup(user_id, hash)
	if err != nil && err != gocql.ErrNotFound {
		return
	}
	if lookup != nil {
		discussion, err = cb.GetDiscussion(user_id, lookup.DiscussionId)
		return
	} else {
		discussion.MarshallNew()
		err = cb.CreateDiscussion(*discussion)
	}
	return
}
