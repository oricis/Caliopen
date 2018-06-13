/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package vault

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type VaultCredentials interface {
	CreateCredentials(rId *RemoteIdentity, cred Credentials) error
	RetrieveCredentials(userId, identifier string) (Credentials, error)
	UpdateCredentials(userId, identifier string, cred Credentials) error
	DeleteCredentials(userId, identifier string) error
}

func (vault *HVaultClient) CreateCredentials(rId *RemoteIdentity, cred Credentials) error {
	return errors.New("[HVaultClient] CreateCredentials not implemented")
}

// RetrieveCrendentials gets credentials from vault, if application has read rights on vault
func (vault *HVaultClient) RetrieveCredentials(userId, identifier string) (cred Credentials, err error) {
	cred = Credentials{}
	err = errors.New("[HVaultClient] RetrieveCredentials not implemented")
	return
}

func (vault *HVaultClient) UpdateCredentials(userId, identifier string, cred Credentials) error {
	return errors.New("[HVaultClient] UpdateCredentials not implemented")
}

func (vault *HVaultClient) DeleteCredentials(userId, identifier string) error {
	return errors.New("[HVaultClient] UpdateCredentials not implemented")
}
