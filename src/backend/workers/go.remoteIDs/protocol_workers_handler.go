// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// protocol_workers_handler handles jobs dispatching and queueing aimed at external protocol workers
// making use of nats messaging system
package go_remoteIDs

import (
	"encoding/json"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
)

type WorkersHandler struct {
}

func initWorkersHandler() (*WorkersHandler, error) {
	return new(WorkersHandler), nil
}

func (wh *WorkersHandler) RequestEmailSyncFor(userId, remoteId string) error {
	log.Debugf("[WorkersHandler] requesting Email sync for user %s, identity %s", userId, remoteId)
	var entry cacheEntry
	var ok bool
	if entry, ok = poller.dbh.GetCacheEntry(userId + remoteId); !ok {
		return errors.New("cache entry not found")
	}

	natsMsg := BrokerOrder{
		Order:    "sync",
		UserId:   entry.userID.String(),
		RemoteId: entry.remoteID.String(),
	}
	j, e := json.Marshal(natsMsg)
	if e != nil {
		log.WithError(e).Warn("[RequestEmailSyncFor] failed to marshal nats message")
		return errors.New("[RequestEmailSyncFor] failed to marshal nats message")

	}
	return poller.mqh.EmitOrder(j, poller.Config.NatsTopics["imap"])
}

func (wh *WorkersHandler) RequestTwitterSyncFor(userId, remoteId string) error {
	log.Debugf("[WorkersHandler] requesting Twitter sync for user %s, identity %s", userId, remoteId)
	var entry cacheEntry
	var ok bool
	if entry, ok = poller.dbh.GetCacheEntry(userId + remoteId); !ok {
		return errors.New("cache entry not found")
	}

	natsMsg := BrokerOrder{
		Order:    "sync",
		UserId:   entry.userID.String(),
		RemoteId: entry.remoteID.String(),
	}
	j, e := json.Marshal(natsMsg)
	if e != nil {
		log.WithError(e).Warn("[RequestEmailSyncFor] failed to marshal nats message")
		return errors.New("[RequestEmailSyncFor] failed to marshal nats message")

	}
	return poller.mqh.EmitOrder(j, poller.Config.NatsTopics["twitter_dm"])
}
