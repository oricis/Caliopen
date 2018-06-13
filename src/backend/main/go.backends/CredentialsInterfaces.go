/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type CredentialsStorage interface {
	CreateCredentials(rId *RemoteIdentity, cred Credentials) error
	RetrieveCredentials(userId, identifier string) (Credentials, error)
	UpdateCredentials(userId, identifier string, cred Credentials) error
	DeleteCredentials(userId, identifier string) error
}
