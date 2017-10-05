// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Notifications

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/nats-io/go-nats"
)

type (
	Notifiers interface {
		EmailNotifiers
	}

	Facility struct {
		queue              *nats.Conn
		nats_outSMTP_topic string
	}
)

func NewNotificationsFacility(config CaliopenConfig, queue *nats.Conn) (notif_facility *Facility) {
	notif_facility = new(Facility)
	notif_facility.queue = queue
	notif_facility.nats_outSMTP_topic = config.NatsConfig.OutSMTP_topic
	return notif_facility
}
