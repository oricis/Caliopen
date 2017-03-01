// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.
//

package store

import (
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.main/helpers"
	log "github.com/Sirupsen/logrus"
)

// UserNameStorage interface implementation for cassandra
func (cb *CassandraBackend) UsernameIsAvailable(username string) (resp bool, err error) {
	resp = false
	err = nil
	lookup := helpers.EscapeUsername(username)
	found := map[string]interface{}{}
	err = cb.Session.Query(`SELECT COUNT(*) FROM user_name WHERE name = ?`, lookup).MapScan(found)
	if err != nil {
		log.WithError(err).Infof("username lookup error : %v", err)
		return
	}
	if found["count"].(int64) != 0 {
		return
	}
	resp = true
	return
}
