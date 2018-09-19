/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/gocql/gocql"
	"log"
	"testing"
)

var ldaI backends.LDAStore

func init() {
	cb, err := InitializeCassandraBackend(CassandraConfig{
		Hosts:        []string{"cassandra"},
		Keyspace:     "caliopen",
		Consistency:  gocql.Consistency(1),
		SizeLimit:    uint64(1048576),
		WithObjStore: false,
		UseVault:     false,
	})
	if err != nil {
		log.Fatal(err)
	}
	ldaI = backends.LDAStore(cb) // interface casting
}

func TestCassandraBackend_GetUsersForLocalMailRecipients(t *testing.T) {
	uids, err := ldaI.GetUsersForLocalMailRecipients([]string{"dev@caliopen.local"})
	if err != nil {
		t.Error(err)
	} else {
		t.Log(uids)
	}
}
