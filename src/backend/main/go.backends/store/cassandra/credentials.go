/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (cb *CassandraBackend) CreateCredentials(rId *RemoteIdentity, cred Credentials) error {

	if cb.UseVault {
		return cb.Vault.CreateCredentials(rId, cred)
	}

	//(re)embed credentials into RemoteIdentity that has already been created
	(*rId).Credentials = cred
	return cb.UpdateRemoteIdentity(rId, map[string]interface{}{
		"Credentials": cred,
	})
}

func (cb *CassandraBackend) RetrieveCredentials(userId, identifier string) (cred Credentials, err error) {

	if cb.UseVault {
		return cb.Vault.RetrieveCredentials(userId, identifier)
	}

	err = cb.Session.Query(`SELECT credentials FROM remote_identity WHERE user_id = ? AND identifier = ?`, userId, identifier).Scan(&cred)

	return
}

func (cb *CassandraBackend) UpdateCredentials() {}
func (cb *CassandraBackend) DeleteCredentials() {}
