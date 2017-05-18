// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/object_store"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
	"time"
)

type (
	CassandraBackend struct {
		CassandraConfig
		Session   *gocql.Session
		IKeyspace gocassa.KeySpace //gocassa keyspace interface
		S3Backend object_store.S3Backend
	}

	CassandraConfig struct {
		Hosts       []string          `mapstructure:"hosts"`
		Keyspace    string            `mapstructure:"keyspace"`
		Consistency gocql.Consistency `mapstructure:"consistency_level"`
		SizeLimit   uint64            `mapstructure:"raw_size_limit"` // max size to store (in bytes)
		WithS3      bool              // whether to use a S3 compatible storage engine for objects above SizeLimit
		object_store.S3Config
	}
)

func InitializeCassandraBackend(config CassandraConfig) (cb *CassandraBackend, err error) {
	cb = new(CassandraBackend)
	err = cb.initialize(config)
	return
}

func (cb *CassandraBackend) initialize(config CassandraConfig) (err error) {

	cb.CassandraConfig = config
	// connect to the cluster
	cluster := gocql.NewCluster(cb.CassandraConfig.Hosts...)
	cluster.Keyspace = cb.Keyspace
	cluster.Consistency = cb.Consistency

	//try to get a Session
	const maxAttempts = 10
	for i := 0; i < maxAttempts; i++ {
		cb.Session, err = cluster.CreateSession()
		if err != nil {
			log.WithError(err).Warn("package store : unable to create a session to cassandra. Retrying in 3 sec…")
			time.Sleep(3 * time.Second)
		} else {
			break
		}
	}
	if err != nil {
		return
	}
	connection := gocassa.NewConnection(gocassa.GoCQLSessionToQueryExecutor(cb.Session))
	cb.IKeyspace = connection.KeySpace(cb.Keyspace)

	if config.WithS3 {
		cb.S3Backend, err = object_store.InitializeS3Backend(config.S3Config)
		if err != nil {
			return err
		}
	}
	return
}

func (cb *CassandraBackend) Close() {
	cb.Session.Close()
}
