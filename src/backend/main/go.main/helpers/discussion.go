// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import (
	"crypto/sha256"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/montanaflynn/stats"
	"sort"
	"strings"
	"time"
)

// ComputeDiscussionIL is the algorithm to return an Importance Level for a discussion
// based on importance levels found within messages of the discussion.
// It returns the average Importance Level of the top 10% most important messages.
// If calculation fails, returned 0.
func ComputeDiscussionIL(messagesIL []float64) float64 {
	rank, err := stats.PercentileNearestRank(messagesIL, 90)
	if err != nil {
		log.WithError(err).Error("[ComputeDiscussionIL] failed to get percentile from set")
		return 0
	}
	var percentile stats.Float64Data
	for _, n := range messagesIL {
		if n >= rank {
			percentile = append(percentile, n)
		}
	}
	mean, err := stats.Mean(percentile)
	if err != nil {
		log.WithError(err).Error("[ComputeDiscussionIL] failed to compute mean from set")
		return 0
	}
	return mean
}

// HashFromParticipatnsUris creates a hash from a collection of Participant
func HashFromParticipantsUris(participants []Participant) (hash string, components []string, err error) {
	urisMap := map[string]struct{}{}
	for _, participant := range participants {
		uri := participant.Protocol + ":" + participant.Address
		urisMap[uri] = struct{}{}
	}
	components = []string{}
	for k, _ := range urisMap {
		components = append(components, k)
	}
	sort.Strings(components)
	sum := sha256.Sum256([]byte(strings.Join(components, "")))
	hash = fmt.Sprintf("%x", sum)
	return
}

// ComputeNewParticipantHash computes a new participants_hash and update participants components
// based on new uri->participant relation provided in params
func ComputeNewParticipantHash(uri, participant string, current ParticipantHash) (new ParticipantHash, err error) {
	return
}

// StoreURIsParticipantsBijection stores uris_hash <-> participants_hash bijection
// in participant_hash table
func StoreURIsParticipantsBijection(session *gocql.Session, userId UUID, uriHash, participantHash string, uriComponents, participantComponents []string) error {
	now := time.Now()
	// store uris_hash -> participants_hash
	e1 := session.Query(`INSERT INTO participant_hash (user_id, kind, key, value, components, date_insert) VALUES (?,?,?,?,?,?)`,
		userId, "uris", uriHash, participantHash, uriComponents, now).Exec()

	// store participants_hash -> uris_hash
	e2 := session.Query(`INSERT INTO participant_hash (user_id, kind, key, value, components, date_insert) VALUES (?,?,?,?,?,?)`,
		userId, "participants", participantHash, uriHash, participantComponents, now).Exec()
	switch {
	case e1 != nil:
		return e1
	case e2 != nil:
		return e2
	}
	return nil
}
