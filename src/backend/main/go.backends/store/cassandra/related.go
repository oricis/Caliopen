/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
)

// UpdateRelated ensure that tables related (joined) to obj are up to date in db,
// ie related objects are updated, or created if isNew is true.
func (cb *CassandraBackend) UpdateRelated(obj HasRelated, isNew bool) error {
	for related := range obj.GetSetRelated() {
		if rel, ok := related.(HasTable); ok {
			if isNew {
				MarshalRelated(obj)
			}

			table, keys := rel.GetTableInfos()
			T := cb.IKeyspace.Table(table, rel, gocassa.Keys{
				PartitionKeys: keys,
			}).WithOptions(gocassa.Options{TableName: table}) // need to overwrite default gocassa table naming convention

			err := T.Set(rel).Run()
			if err != nil {
				return fmt.Errorf("[CassandraBackend] UpdateRelated: %s", err)
			}
		}
	}
	return nil
}

func (cb *CassandraBackend) RetrieveRelated(obj interface{}) error {

	return errors.New("RetrieveRelated not implemented")
}

// DeleteRelated ensure that tables related (joined) to obj are up to date in db,
// ie related objects are deleted accordingly.
func (cb *CassandraBackend) DeleteRelated(obj interface{}) error {

	return errors.New("DeleteRelated not implemented")
}
