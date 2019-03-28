// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type CredentialStore struct{}

func (cs CredentialStore) CreateCredentials(userIdentity *UserIdentity, cred Credentials) error {
	return errors.New("test interface not implemented")
}
func (cs CredentialStore) RetrieveCredentials(userId, remoteId string) (Credentials, error) {
	return nil, errors.New("test interface not implemented")
}
func (cs CredentialStore) UpdateCredentials(userId, remoteId string, cred Credentials) error {
	return errors.New("test interface not implemented")
}
func (cs CredentialStore) DeleteCredentials(userId, remoteId string) error {
	return errors.New("test interface not implemented")
}
