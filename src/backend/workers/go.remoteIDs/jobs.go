// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// jobs are implementations of cron.Job interface to give to MainCron scheduler
package go_remoteIDs

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
)

type syncJob struct {
	protocol string
	remoteId string
	userId   string
}

// Run implements cron.Job interface to call relevant worker according to job's protocol
func (j syncJob) Run() {
	var err error
	switch j.protocol {
	case ImapProtocol, EmailProtocol:
		err = poller.wh.RequestEmailSyncFor(j.userId, j.remoteId)
	case TwitterProtocol:
		err = poller.wh.RequestTwitterSyncFor(j.userId, j.remoteId)
	default:
		err = fmt.Errorf("[syncJob] Run() with unknown protocol : %+v", j)
	}
	if err != nil {
		log.WithError(err).Warnf("[syncJob] failed to run job for user : %, identity : %s", j.userId, j.remoteId)
	}
}
