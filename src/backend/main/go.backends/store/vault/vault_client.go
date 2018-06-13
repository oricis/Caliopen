/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

// vault_client provides an interface to interact with HashiCorp Vault server

package vault

import "errors"

// InitializeVaultBackend checks if a Vault server is available and returns a VaultClient
func InitializeVaultBackend() (vault HVault, err error) {

	return nil, errors.New("HVault not implemented")
}
