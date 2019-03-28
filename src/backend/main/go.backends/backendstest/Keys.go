// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type KeysStore struct{}

func (ks KeysStore) CreatePGPPubKey(pubkey *PublicKey) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ks KeysStore) RetrieveContactPubKeys(userId, contactId string) (PublicKeys, CaliopenError) {
	return nil, NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ks KeysStore) RetrievePubKey(userId, resourceId, keyId string) (*PublicKey, CaliopenError) {
	return nil, NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ks KeysStore) DeletePubKey(pubkey *PublicKey) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ks KeysStore) UpdatePubKey(newPubKey, oldPubKey *PublicKey, modifiedFields map[string]interface{}) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
