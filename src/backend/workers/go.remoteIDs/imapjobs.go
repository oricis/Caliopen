/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package go_remoteIDs

import (
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/Sirupsen/logrus"
)

type imapJob struct {
	identifier string
	natsTopic  string
	poller     *Poller
	userId     string
}

func (j imapJob) Run() {
	msg, err := json.Marshal(IMAPfetchOrder{
		Order:      "sync",
		UserId:     j.userId,
		Identifier: j.identifier,
	})
	if err != nil {
		logrus.WithError(err).Fatal("unable to marshal natsOrder")
	}

	j.poller.NatsConn.Publish(j.natsTopic, msg)
	j.poller.NatsConn.Flush()

	if err := j.poller.NatsConn.LastError(); err != nil {
		logrus.WithError(err).Fatal("nats publish failed")
	}

	logrus.Infof("ordering to sync mailbox from %s for user %s", j.identifier, j.userId)
}
