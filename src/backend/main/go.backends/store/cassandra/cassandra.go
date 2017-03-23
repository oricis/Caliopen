// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
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
	}

	CassandraConfig struct {
		Hosts       []string          `mapstructure:"hosts"`
		Keyspace    string            `mapstructure:"keyspace"`
		Consistency gocql.Consistency `mapstructure:"consistency_level"`
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

	connection := gocassa.NewConnection(gocassa.GoCQLSessionToQueryExecutor(cb.Session))
	cb.IKeyspace = connection.KeySpace(cb.Keyspace)

	return
}

func (cb *CassandraBackend) Close() {
	cb.Session.Close()
}
