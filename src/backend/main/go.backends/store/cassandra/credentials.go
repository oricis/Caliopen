/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
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

func (cb *CassandraBackend) UpdateCredentials(userId, identifier string, cred Credentials) error {

	if cb.UseVault {
		return cb.Vault.UpdateCredentials(userId, identifier, cred)
	}

	ridT := cb.IKeyspace.Table("remote_identity", &RemoteIdentity{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "identifier"},
	}).WithOptions(gocassa.Options{TableName: "remote_identity"})

	return ridT.Where(gocassa.Eq("user_id", userId), gocassa.Eq("identifier", identifier)).
		Update(map[string]interface{}{
			"credentials": cred,
		}).Run()
}

func (cb *CassandraBackend) DeleteCredentials(userId, identifier string) error {

	if cb.UseVault {
		return cb.Vault.DeleteCredentials(userId, identifier)
	}

	return cb.UpdateCredentials(userId, identifier, Credentials{})

	return nil
}
