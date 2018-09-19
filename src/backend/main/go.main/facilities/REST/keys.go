/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	log "github.com/Sirupsen/logrus"
	"github.com/bitly/go-simplejson"
	"github.com/gin-gonic/gin/json"
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
		return nil, WrapCaliopenErr(err, DbCaliopenErr, "[CreatePGPPubKey] store failed to create PGP key")
	}

	natsMsg := PublishKeyMessage{
		Order:      "publish_key",
		UserId:     pubKey.UserId.String(),
		ResourceId: pubKey.ResourceId.String(),
		KeyId:      pubKey.KeyId.String(),
	}
	jsonMsg, err := json.Marshal(natsMsg)
	if err != nil {
		log.WithError(err).Warn("[RESTfacility]CreatePGPPubKey failed to marshal nats message")
	} else {
		e := rest.nats_conn.Publish(rest.natsTopics[Nats_Keys_topicKey], jsonMsg)
		if e != nil {
			log.WithError(err).Warn("[RESTfacility]CreatePGPPubKey failed to publish nats message")
		}
	}

	return pubKey, nil
}

func (rest *RESTfacility) RetrieveContactPubKeys(userId, contactId string) (pubkeys PublicKeys, err CaliopenError) {
	return rest.store.RetrieveContactPubKeys(userId, contactId)
}

func (rest *RESTfacility) RetrievePubKey(userId, resourceId, keyId string) (pubkey *PublicKey, err CaliopenError) {
	return rest.store.RetrievePubKey(userId, resourceId, keyId)
}

// PatchPubKey is a shortcut for REST api to :
// - retrieve pubkey from db
// - UpdateWithPatch() with UserActor role
// - then UpdatePubKey() to save updated key in store
func (rest *RESTfacility) PatchPubKey(patch []byte, userId, resourceId, keyId string) CaliopenError {

	current_pubkey, err := rest.RetrievePubKey(userId, resourceId, keyId)
	if err != nil {
		return err
	}

	// read into the patch to make basic controls before processing it with generic helper
	patchReader, e := simplejson.NewJson(patch)
	if e != nil {
		return NewCaliopenErrf(FailDependencyCaliopenErr, "[RESTfacility]PatchPubKey failed with simplejson error : %s", e)
	}
	// checks "current_state" property is present
	if _, hasCurrentState := patchReader.CheckGet("current_state"); !hasCurrentState {
		return NewCaliopenErr(ForbiddenCaliopenErr, "[RESTfacility]PatchPubKey : current_state property must be in patch")
	}
	// patch seams OK, apply it to the resource
	var modifiedFields map[string]interface{}
	newPubKey, modifiedFields, e := helpers.UpdateWithPatch(patch, current_pubkey, UserActor)
	if e != nil {
		return NewCaliopenErrf(FailDependencyCaliopenErr, "[RESTfacility]PatchPubKey failed to call UpdateWithPatch : %s", e)
	}

	// save updated resource
	return rest.UpdatePubKey(newPubKey.(*PublicKey), current_pubkey, modifiedFields)
}

func (rest *RESTfacility) UpdatePubKey(newPubKey, oldPubKey *PublicKey, modifiedFields map[string]interface{}) CaliopenError {
	return rest.store.UpdatePubKey(newPubKey, oldPubKey, modifiedFields)
}

func (rest *RESTfacility) DeletePubKey(pubKey *PublicKey) CaliopenError {
	err := rest.store.DeletePubKey(pubKey)
	if err != nil {
		return err
	}
	natsMsg := PublishKeyMessage{
		Order:      "delete_key",
		UserId:     pubKey.UserId.String(),
		ResourceId: pubKey.ResourceId.String(),
		KeyId:      pubKey.KeyId.String(),
	}
	jsonMsg, e := json.Marshal(natsMsg)
	if e != nil {
		log.WithError(e).Warn("[RESTfacility]CreatePGPPubKey failed to marshal nats message")
	} else {
		e := rest.nats_conn.Publish(rest.natsTopics[Nats_Keys_topicKey], jsonMsg)
		if e != nil {
			log.WithError(err).Warn("[RESTfacility]CreatePGPPubKey failed to publish nats message")
		}
	}
	return nil
}
