/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/keybase/go-crypto/openpgp"
)

// CreatePGPPubKey create and store a PublicKey object for given contact
// it takes either PEM or DER encoded GPG public key, extracting as much possible data into struct's properties
func (rest *RESTfacility) CreatePGPPubKey(label string, pubkey []byte, contact *Contact) (*PublicKey, CaliopenError) {
	reader := bytes.NewReader(pubkey)
	var entitiesList openpgp.EntityList
	var err error

	entitiesList, err = openpgp.ReadArmoredKeyRing(reader)
	if err != nil {
		// pubkey should be DER encoded
		reader.Reset(pubkey)
		entitiesList, err = openpgp.ReadKeyRing(reader)
	}

	if err != nil {
		return nil, NewCaliopenErr(FailDependencyCaliopenErr, err.Error())
	}

	//handle only first key found for now
	if len(entitiesList) > 1 {
		return nil, NewCaliopenErr(FailDependencyCaliopenErr, "more than one key found in payload")
	}

	pubKey := new(PublicKey)
	err = pubKey.UnmarshalPGPEntity(label, entitiesList[0], contact)
	if err != nil {
		return nil, NewCaliopenErr(FailDependencyCaliopenErr, err.Error())
	}

	err = rest.store.CreatePGPPubKey(pubKey)
	if err != nil {
		return pubKey, WrapCaliopenErr(err, DbCaliopenErr, "[CreatePGPPubKey] store failed to create PGP key")
	}

	return pubKey, nil
}
