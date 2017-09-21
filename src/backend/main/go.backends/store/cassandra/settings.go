// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (cb *CassandraBackend) GetSettings(user_id string) (settings *obj.Settings, err error) {

	settings = &obj.Settings{}
	m := map[string]interface{}{}
	q := cb.Session.Query(`SELECT * FROM settings WHERE user_id = ?`, user_id)
	err = q.MapScan(m)
	if err != nil {
		return nil, err
	}
	settings.UnmarshalCQLMap(m)
	return settings, err
}