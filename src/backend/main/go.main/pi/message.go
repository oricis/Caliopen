// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package pi

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"math"
	"strconv"
	"strings"
)

// ComputePIMessage returns estimated PIMessage values
func ComputePIMessage(message *Message) *PIMessage {
	piMessage := &PIMessage{Transport: 0, Social: 0, Content: 0}
	features := *message.Privacy_features
	// pi.Content
	if encrypted, ok := features["messsage_encryption_method"]; ok && encrypted != "" {
		piMessage.Content += 50
	}
	signed, ok := features["message_signed"]
	// TODO : have a correct unmarshalling of typed features
	if ok && len(signed) > 0 && strings.ToLower(string(signed[0])) == "t" {
		piMessage.Content += 20
	}

	// pi.Social
	known_participants := 0.0
	for _, participant := range message.Participants {
		if len(participant.Contact_ids) > 0 {
			known_participants += 1
		}
	}
	if known_participants > 1 {
		// user contact is included
		known_participants -= 1
	}
	ratio := known_participants / float64(len(message.Participants)) * 100
	piMessage.Social += uint32(math.Min(80, ratio))

	// pi.Transport
	trSigned, ok := features["transport_signed"]
	// TODO : have a correct unmarshalling of typed features
	if ok && len(trSigned) > 0 && strings.ToLower(string(trSigned[0])) == "t" {
		piMessage.Transport += 20
	}
	nbHops, ok := features["nb_external_hops"]
	if ok {
		value, err := strconv.Atoi(nbHops)
		if err == nil && value <= 5 {
			bump := float64((-5 * value) + 25.0)
			piMessage.Transport += uint32(math.Max(0, bump))
		}
	}
	inCipher, ok := features["ingress_cipher"]
	if ok && inCipher != "" {
		piMessage.Transport += 20
	}
	// TODO : normalize
	return piMessage
}
