// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package go_remoteIDs

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"gopkg.in/robfig/cron.v2"
	"sync"
)

type DbHandler struct {
	cache           map[string]cacheEntry
	cacheMux        *sync.Mutex
	remoteProtocols []string
	Store           backends.IdentityStorage
}

type cacheEntry struct {
	cronId         cron.EntryID
	iDkey          string
	pollInterval   string // in minutes
	remoteID       UUID
	remoteProtocol string
	userID         UUID
}

func initDbHandler() (*DbHandler, error) {
	handler := new(DbHandler)
	handler.remoteProtocols = poller.Config.RemoteProtocols
	switch poller.Config.StoreName {
	case "cassandra":
		c := store.CassandraConfig{
			Hosts:       poller.Config.StoreConfig.Hosts,
			Keyspace:    poller.Config.StoreConfig.Keyspace,
			Consistency: gocql.Consistency(poller.Config.StoreConfig.Consistency),
			SizeLimit:   poller.Config.StoreConfig.SizeLimit,
		}
		if poller.Config.StoreConfig.ObjectStore == "s3" {
			c.WithObjStore = true
			c.Endpoint = poller.Config.StoreConfig.OSSConfig.Endpoint
			c.AccessKey = poller.Config.StoreConfig.OSSConfig.AccessKey
			c.SecretKey = poller.Config.StoreConfig.OSSConfig.SecretKey
			c.RawMsgBucket = poller.Config.StoreConfig.OSSConfig.Buckets["raw_messages"]
			c.AttachmentBucket = poller.Config.StoreConfig.OSSConfig.Buckets["temporary_attachments"]
			c.Location = poller.Config.StoreConfig.OSSConfig.Location
		}
		db, err := store.InitializeCassandraBackend(c)
		if err != nil {
			log.WithError(err).Warnf("[initDbHandler] initialization of %s backend failed", poller.Config.StoreName)
			return handler, errors.New("[initDbHandler] failed to init cassandra backend")
		}
		handler.Store = db
		handler.cache = make(map[string]cacheEntry)
		handler.cacheMux = new(sync.Mutex)
		return handler, nil
	default:
		return handler, fmt.Errorf("[initDbHandler] unhandled store : %s", poller.Config.StoreName)
	}
}

// SyncCache resync DbHandler's memory cache with 'active' remote identities found in db
func (dbh *DbHandler) SyncCache() (added, removed, updated map[string]cacheEntry, err error) {
	added = make(map[string]cacheEntry)
	removed = make(map[string]cacheEntry)
	updated = make(map[string]cacheEntry)
	active := make(map[string]cacheEntry)
	const defaultInterval = "15"

	remotes, err := dbh.Store.RetrieveAllRemotes(false)
	if err != nil {
		log.WithError(err).Warn("[updateCache] failed to retrieve remote identities")
		err = errors.New("[updateCache] failed to retrieve remote identities")
		return
	}

	dbh.cacheMux.Lock()
	defer dbh.cacheMux.Unlock()
	for remote := range remotes {
		if dbh.statusTypeOK(remote) {
			idkey := remote.UserId.String() + remote.Id.String()
			active[idkey] = cacheEntry{}
			if entry, ok := dbh.cache[idkey]; ok {
				//check if pollinterval has changed
				var pollInterval string
				var ok bool
				if pollInterval, ok = remote.Infos["pollinterval"]; !ok || pollInterval == "" {
					// do not resign, take a default value instead
					pollInterval = defaultInterval
				}
				if entry.pollInterval != pollInterval {
					entry.pollInterval = pollInterval
					updated[idkey] = entry
					dbh.cache[idkey] = entry
				}
			} else {
				var pollInterval string
				var ok bool
				if pollInterval, ok = remote.Infos["pollinterval"]; !ok || pollInterval == "" {
					// do not resign, take a default value instead
					pollInterval = defaultInterval
				}
				entry := cacheEntry{
					iDkey:          idkey,
					pollInterval:   pollInterval,
					remoteID:       remote.Id,
					remoteProtocol: remote.Protocol,
					userID:         remote.UserId,
				}
				dbh.cache[idkey] = entry
				added[idkey] = entry
			}
		}
	}
	for key, entry := range dbh.cache {
		if _, ok := active[key]; !ok {
			removed[key] = entry
			delete(dbh.cache, key)
		}
	}
	return
}

// statusTypeOK checks if remote identity is 'active' and its type is within poller's scope
func (dbh *DbHandler) statusTypeOK(remote *UserIdentity) bool {
	if remote.Status != "active" {
		return false
	}
	for _, t := range dbh.remoteProtocols {
		if t == remote.Protocol {
			return true
		}
	}
	return false
}

func (dbh *DbHandler) GetCacheEntry(key string) (cacheEntry, bool) {
	dbh.cacheMux.Lock()
	entry, ok := dbh.cache[key]
	dbh.cacheMux.Unlock()
	return entry, ok
}

func (dbh *DbHandler) UpdateCacheEntry(entry cacheEntry) {
	dbh.cacheMux.Lock()
	dbh.cache[entry.iDkey] = entry
	dbh.cacheMux.Unlock()
}

func (dbh *DbHandler) RemoveCacheEntry(key string) {
	dbh.cacheMux.Lock()
	delete(dbh.cache, key)
	dbh.cacheMux.Unlock()
}

func (dbh *DbHandler) Stop() {
	dbh.Store.Close()
	dbh.cacheMux.Lock()
	dbh.cache = nil
	dbh.cacheMux.Unlock()
}
