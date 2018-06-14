/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

// vault_client provides an interface to interact with HashiCorp Vault server

package vault

import (
	hvault "github.com/hashicorp/vault/api"
)

type HVaultClient struct {
	hclient *hvault.Client
}

const credentialsPath = "secret/data/%s/%s" // path to store credentials => secret/data/user_id/remote_id

// InitializeVaultBackend checks if a Vault server is available and returns a VaultClient
func InitializeVaultBackend() (hv HVault, err error) {
	config := hvault.DefaultConfig()
	config.Address = "http://127.0.0.1:8200"

	var hc HVaultClient

	hc.hclient, err = hvault.NewClient(config)
	if err != nil {
		return nil, err
	}

	hc.hclient.SetToken("3a995021-7b93-b4bd-f327-28a7bfa4ef50")
	hc.hclient.Auth()

	_, err = hc.hclient.Sys().Health()
	if err != nil {
		return nil, err
	}

	return &hc, nil
}
