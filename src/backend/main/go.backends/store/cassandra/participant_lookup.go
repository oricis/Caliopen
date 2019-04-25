// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
	"strings"
)

func (cb *CassandraBackend) LookupHash(user_id UUID, uri string) (hashes []HashLookup, err error) {
	rawHashes := []map[string]interface{}{}
	clean_uri := strings.ToLower(uri)
	rawHashes, err = cb.SessionQuery(`SELECT * FROM hash_lookup WHERE user_id = ? AND uri = ?`, user_id, clean_uri).Iter().SliceMap()
	if err != nil {
		return
	}
	if len(rawHashes) == 0 {
		err = errors.New("not found")
		return
	}
	for _, hash := range rawHashes {
		h := new(HashLookup)
		h.UnmarshalCQLMap(hash)
		hashes = append(hashes, *h)
	}
	return
}

func (cb *CassandraBackend) CreateHashLookup(participant HashLookup) error {
	lookupT := cb.IKeyspace.Table("hash_lookup", &HashLookup{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "uri", "hash"},
	}).WithOptions(gocassa.Options{TableName: "hash_lookup"}) // need to overwrite default gocassa table naming convention

	// save lookup
	err := lookupT.Set(participant).Run()
	if err != nil {
		return fmt.Errorf("[CassandraBackend] CreateHashLookup: %s", err)
	}
	return nil
}
