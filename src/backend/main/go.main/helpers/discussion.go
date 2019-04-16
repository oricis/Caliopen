// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import (
	log "github.com/Sirupsen/logrus"
	"github.com/montanaflynn/stats"
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
