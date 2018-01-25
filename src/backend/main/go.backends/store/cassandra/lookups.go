/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// UpdateLookups ensure that tables lookup related to are up to date in db,
// it updates values with `new` state and delete lookups that have been removed
func (cb *CassandraBackend) UpdateLookups(new, old HasLookup, isNew bool) error {
	var err error
	// update db with current values
	for _, lookup := range new.GetLookupsTables() {
		if updateFunc := lookup.UpdateLookups(new, old); updateFunc != nil {
			err = updateFunc(cb.Session)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

// DeleteLookups ensure that tables related (joined) to obj are up to date in db,
// ie related objects are deleted accordingly.
func (cb *CassandraBackend) DeleteLookups(obj HasLookup) error {
	var err error
	for _, lookup := range obj.GetLookupsTables() {
		if cleanup := lookup.CleanupLookups(obj); cleanup != nil {
			err = cleanup(cb.Session)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
