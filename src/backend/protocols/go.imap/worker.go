/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
)

type Worker struct {
	Config   WorkerConfig
	Lda      *Lda
	NatsConn *nats.Conn
	Store    *store.CassandraBackend
}

// NewWorker loads config, checks for errors then returns a worker ready to start.
func NewWorker(config WorkerConfig) (worker *Worker, err error) {

	w := Worker{Config: config}
	//copy relevant config to LDAConfig
	w.Config.LDAConfig.StoreName = w.Config.StoreName
	w.Config.LDAConfig.NatsURL = w.Config.NatsUrl
	w.Config.LDAConfig.StoreConfig = w.Config.StoreConfig

	// init all connexions, they will be pass to fetchers
	// Lda
	w.Lda, err = NewLda(w.Config)
	if err != nil {
		log.WithError(err).Warn("[NewWorker] : initalization of LDA failed")
		return nil, err
	}

	// Nats
	w.NatsConn, err = nats.Connect(config.NatsUrl)
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
		w.Store, err = store.InitializeCassandraBackend(c)
		if err != nil {
			log.WithError(err).Warnf("[NewWorker] initalization of %s backend failed", config.StoreName)
			return nil, err
		}
	}

	return &w, nil
}

func (worker *Worker) Start(index uint8) {
	log.Infof("IMAP worker %d started", index)
}

func (worker *Worker) Stop(index uint8) {
	log.Infof("stopping IMAP worker %d", index)
	log.Infof("worker %d stopped", index)
}
