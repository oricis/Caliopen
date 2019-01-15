// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package pi

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"math"
	"strings"
)

// ComputePIMessage returns estimated PIMessage values
func ComputePIMessage(message *Message) {
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
			known_participants += 1.0
		}
	}
	ratio := known_participants / float64(len(message.Participants)) * 100
	piMessage.Social += uint32(math.Min(50, ratio))

	// pi.Transport
	trSigned, ok := features["transport_signed"]
	// TODO : have a correct unmarshalling of typed features
	if ok && len(trSigned) > 0 && strings.ToLower(string(trSigned[0])) == "t" {
		piMessage.Transport += 20
	}
	message.PI = piMessage
}
