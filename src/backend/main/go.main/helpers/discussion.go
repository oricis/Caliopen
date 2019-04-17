// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import (
	"crypto/sha256"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/montanaflynn/stats"
	"sort"
	"strings"
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
