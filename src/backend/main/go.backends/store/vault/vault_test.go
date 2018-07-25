/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package vault

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	hvault "github.com/hashicorp/vault/api"
	"testing"
)

func TestInitializeVaultBackend(t *testing.T) {
	config := hvault.DefaultConfig()
	config.Address = "http://127.0.0.1:8200"
	hclient, err := hvault.NewClient(config)
	if err != nil {
		t.Fatal(err)
	}

	hclient.SetToken("df278062-b68a-037d-0612-77861fdfec12")
	hclient.Auth()

	_, err = hclient.Sys().Health()
	if err != nil {
		t.Fatal(err)
	}

	cred := objects.Credentials{
		"password": "pass",
		"username": "user",
	}
	payload := make(map[string]interface{})
	payload["data"] = cred
	_, err = hclient.Logical().Write("secret/data/userid/remoteid", payload)
	if err != nil {
		t.Fatal(err)
	}
	secret, err := hclient.Logical().Read("secret/data/userid/remoteid")
	if err != nil {
		t.Fatal(err)
	}
	if pass, ok := secret.Data["data"].(map[string]interface{})["password"]; !ok || pass.(string) != "pass" {
		t.Error("failed to retrieve password")
	}
	if name, ok := secret.Data["data"].(map[string]interface{})["username"]; !ok || name.(string) != "user" {
		t.Error("failed to retrieve username")
	}
}
