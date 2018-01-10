/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// UpdateLookups ensure that tables lookup related to obj are up to date in db,
func (cb *CassandraBackend) UpdateLookups(obj HasLookup, isNew bool) error {
	var err error
	for _, lookup := range obj.GetLookupsTables() {
		if update := lookup.UpdateLookups(obj); update != nil {
			err = update(cb.Session)
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
