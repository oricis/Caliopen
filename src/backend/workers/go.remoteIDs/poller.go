/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package go_remoteIDs

import (
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
	"gopkg.in/robfig/cron.v2"
	"strconv"
)

type Poller struct {
	Cache    map[string]cacheEntry
	Config   PollerConfig
	MainCron *cron.Cron
	NatsConn *nats.Conn
	Store    backends.IdentityStorage
}

func NewPoller(config PollerConfig) (poller *Poller, err error) {
	p := Poller{
		Config:   config,
		Cache:    make(map[string]cacheEntry),
		MainCron: cron.New(),
	}

	// Nats
	p.NatsConn, err = nats.Connect(config.NatsUrl)
	if err != nil {
		log.WithError(err).Warn("[NewWorker] : initalization of NATS connexion failed")
		return nil, err
	}

	// Store
	switch config.StoreName {
	case "cassandra":
		c := store.CassandraConfig{
			Hosts:       config.StoreConfig.Hosts,
			Keyspace:    config.StoreConfig.Keyspace,
			Consistency: gocql.Consistency(config.StoreConfig.Consistency),
			SizeLimit:   config.StoreConfig.SizeLimit,
		}
		if config.StoreConfig.ObjectStore == "s3" {
			c.WithObjStore = true
			c.Endpoint = config.StoreConfig.OSSConfig.Endpoint
			c.AccessKey = config.StoreConfig.OSSConfig.AccessKey
			c.SecretKey = config.StoreConfig.OSSConfig.SecretKey
			c.RawMsgBucket = config.StoreConfig.OSSConfig.Buckets["raw_messages"]
			c.AttachmentBucket = config.StoreConfig.OSSConfig.Buckets["temporary_attachments"]
			c.Location = config.StoreConfig.OSSConfig.Location
		}
		p.Store, err = store.InitializeCassandraBackend(c)
		if err != nil {
			log.WithError(err).Warnf("[NewWorker] initalization of %s backend failed", config.StoreName)
			return nil, err
		}
	}

	return &p, nil
}

func (p *Poller) Start() error {
	cronStr := "@every " + strconv.Itoa(int(p.Config.ScanInterval)) + "m"
	_, err := p.MainCron.AddFunc(cronStr, p.poll)
	if err != nil {
		//TODO
	}
	// run poll() once before starting MainCron
	p.poll()
	p.MainCron.Start()
	return nil
}

func (p *Poller) Stop() {
	//TODO : iterate over running jobs ?
	p.MainCron.Stop()
	p.NatsConn.Close()
	p.Store.Close()
}

func (p *Poller) poll() {

	log.Info("updating poll crons")
	// 1. update cache with 'active' remote identities found in db
	added, removed, updated, err := p.updateCache()
	if err != nil {
		log.WithError(err).Warn("[poll] failed to update cache")
		return
	}
	// 2. iterate to add/remove jobs to MainCron
	for idkey := range added {
		p.AddJobFor(idkey)
	}
	for idkey := range removed {
		p.RemoveJobFor(idkey)
	}
	for idkey := range updated {
		p.UpdateJobFor(idkey)
	}
}
