// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/gocassa/gocassa"
	"strings"
	"time"
)

func (cb *CassandraBackend) GetUserLookupHashes(userId UUID, kind, key string) (hashes []ParticipantHash, err error) {
	var rawHashes []map[string]interface{}
	if key != "" {
		rawHashes, err = cb.SessionQuery(`SELECT * from participant_hash WHERE user_id = ? AND kind = ? AND key = ?`, userId, kind, key).Iter().SliceMap()
	} else {
		rawHashes, err = cb.SessionQuery(`SELECT * from participant_hash WHERE user_id = ? AND kind = ?`, userId, kind).Iter().SliceMap()
	}
	if err != nil {
		return
	}
	if len(rawHashes) == 0 {
		err = errors.New("not found")
		return
	}
	for _, hash := range rawHashes {
		h := new(ParticipantHash)
		h.UnmarshalCQLMap(hash)
		hashes = append(hashes, *h)
	}
	return
}

func (cb *CassandraBackend) RetrieveParticipantHash(userId UUID, kind, hash string) (lookup ParticipantHash, err error) {
	m := map[string]interface{}{}
	q := cb.SessionQuery(`SELECT * from participant_hash WHERE user_id = ? AND kind = ? AND key = ?`, userId, kind, hash)
	err = q.MapScan(m)
	if err != nil {
		return
	}
	lookup.UnmarshalCQLMap(m)
	return
}

func (cb *CassandraBackend) CreateParticipantHash(lookup *ParticipantHash) error {
	lookupT := cb.IKeyspace.Table("participant_hash", &ParticipantHash{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "kind", "key", "value"},
	}).WithOptions(gocassa.Options{TableName: "participant_hash"}) // need to overwrite default gocassa table naming convention

	// save lookup
	err := lookupT.Set(lookup).Run()
	if err != nil {
		return fmt.Errorf("[CassandraBackend] CreateParticipantHash: %s", err)
	}
	return nil
}

// UpsertDiscussionLookups ensures that relevant entries are present in both HashLookup and ParticipantHash tables
// for the provided participants, taking into account user's contacts addresses
func (cb *CassandraBackend) UpsertDiscussionLookups(userId UUID, participants []Participant) error {
	hash, components, err := helpers.HashFromParticipantsUris(participants)
	if err != nil {
		return err
	}
	hashes, err := cb.GetUserLookupHashes(userId, "uris", hash)
	if err != nil {
		if err.Error() != "not found" {
			return err
		} else {
			return cb.CreateLookupsFromUris(userId, hash, components)
		}
	}
	if len(hashes) == 0 {
		return cb.CreateLookupsFromUris(userId, hash, components)
	}
	if len(hashes) != 1 {
		return fmt.Errorf("[UpsertDiscussionLookups] found inconsistent participants_hash for user %s and uris_hash %s", userId.String(), hash)
	}
	return nil
}

// CreateLookupsFromUris resolves uris to contact to build participants' set
// then computes participants_hash
// then creates two ways links in HashLookup and ParticipantLookup tables:
//    uris<->uris_hash
//    uris_hash<->participants_hash
func (cb *CassandraBackend) CreateLookupsFromUris(userId UUID, hash string, uris []string) error {
	participants := []Participant{}
	for _, uri := range uris {
		uriSplit := strings.SplitN(uri, ":", 1)
		contacts, err := cb.LookupContactsByIdentifier(userId.String(), uriSplit[1], uriSplit[0])
		if err != nil {
			return err
		}
		if len(contacts) > 0 {
			participants = append(participants, Participant{Address: contacts[0], Protocol: "contact"})
		} else {
			participants = append(participants, Participant{Address: uriSplit[1], Protocol: uriSplit[0]})
		}
	}
	participantsHash, participantsComponents, err := helpers.HashFromParticipantsUris(participants)
	if err != nil {
		return err
	}
	now := time.Now()
	// store uris_hash -> participants_hash
	e1 := cb.CreateParticipantHash(&ParticipantHash{
		UserId:     userId,
		Kind:       "uris",
		Key:        hash,
		Value:      participantsHash,
		Components: uris,
		DateInsert: now,
	})
	// store participants_hash -> uris_hash
	e2 := cb.CreateParticipantHash(&ParticipantHash{
		UserId:     userId,
		Kind:       "participants",
		Key:        participantsHash,
		Value:      hash,
		Components: participantsComponents,
		DateInsert: now,
	})
	switch {
	case e1 != nil:
		return e1
	case e2 != nil:
		return e2
	}
	for _, uri := range uris {
		// store uri->uris_hash
		e := cb.CreateHashLookup(HashLookup{
			UserId:         userId,
			Uri:            uri,
			Hash:           hash,
			HashComponents: uris,
			DateInsert:     now,
		})
		if e != nil {
			return e
		}
	}
	return nil
}
