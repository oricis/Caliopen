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

var is backends.IdentityStorage
var cb *CassandraBackend

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
	is = backends.IdentityStorage(cb) // interface casting
}

func TestCassandraBackend_RetrieveAllRemotes(t *testing.T) {
	remotes, err := is.RetrieveAllRemotes(false)
	if err != nil {
		t.Fatal(err)
	}
	for remote := range remotes {
		t.Log(remote)
	}

}

func TestCassandraBackend_LookupIdentityByIdentifier(t *testing.T) {
	identities, err := is.LookupIdentityByIdentifier("stanlogin")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("stanlogin : %v", identities)
	}
	identities, err = is.LookupIdentityByIdentifier("stanlogin", "imap")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("stanlogin [imap] : %v", identities)
	}
	identities, err = is.LookupIdentityByIdentifier("stanlogin", "smtp")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("stanlogin [smtp] : %v", identities)
	}
	identities, err = is.LookupIdentityByIdentifier("stanlogin", "imap", "6cc36d88-6163-4465-805a-cacf58f455e4")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("stanlogin [imap] [user_id] : %v", identities)
	}
}

func TestCassandraBackend_LookupIdentityByType(t *testing.T) {
	locals, err := is.LookupIdentityByType("local")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("all locals : %v", locals)
	}

	locals, err = is.LookupIdentityByType("local", "6cc36d88-6163-4465-805a-cacf58f455e4")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("one local : %v", locals)
	}

	remotes, err := is.LookupIdentityByType("remote")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("all remotes : %v", remotes)
	}
	remotes, err = is.LookupIdentityByType("remote", "6cc36d88-6163-4465-805a-cacf58f455e4")
	if err != nil {
		t.Error(err)
	} else {
		t.Logf("one remote : %v", remotes)
	}
}
