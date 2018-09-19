/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (cb *CassandraBackend) CreatePGPPubKey(pubkey *PublicKey) CaliopenError {
	// write complete statement because gocassa failed to retrieve tag "use" and write quotes to cassandra
	err := cb.Session.Query(`UPDATE public_key SET 
	alg = ?,
	crv = ?,
	date_insert = ?,
	date_update = ?,
	expire_date = ?,
	fingerprint = ?,
	key = ?,
	kty = ?,
	label = ?,
	resource_type = ?,
	size = ?,
	"use" = ?,
	x = ?,
	y = ?
	WHERE user_id = ? AND resource_id = ? AND key_id = ?`,
		pubkey.Algorithm,
		pubkey.Curve,
		pubkey.DateInsert,
		pubkey.DateUpdate,
		pubkey.ExpireDate,
		pubkey.Fingerprint,
		pubkey.Key,
		pubkey.KeyType,
		pubkey.Label,
		pubkey.ResourceType,
		pubkey.Size,
		pubkey.Use,
		pubkey.X,
		pubkey.Y,
		pubkey.UserId,
		pubkey.ResourceId,
		pubkey.KeyId).Exec()

	if err != nil {
		return NewCaliopenErrf(DbCaliopenErr, "[CassandraBackend]CreatePGPPubKey db error : %s", err.Error())
	}
	return nil
}

func (cb *CassandraBackend) RetrieveContactPubKeys(userId, contactId string) (keys PublicKeys, err CaliopenError) {
	ks, e := cb.Session.Query(`SELECT * FROM public_key WHERE user_id = ? AND resource_id = ?`, userId, contactId).Iter().SliceMap()
	if e != nil {
		return nil, WrapCaliopenErrf(e, DbCaliopenErr, "[CassandraBackend]RetrieveContactPubKeys failed")
	}
	for _, k := range ks {
		pubkey := new(PublicKey)
		pubkey.UnmarshalCQLMap(k)
		keys = append(keys, *pubkey)
	}
	return
}

func (cb *CassandraBackend) RetrievePubKey(userId, resourceId, keyId string) (pubkey *PublicKey, err CaliopenError) {
	result := map[string]interface{}{}
	e := cb.Session.Query(`SELECT * FROM public_key WHERE user_id = ? AND resource_id = ? AND key_id = ?`, userId, resourceId, keyId).MapScan(result)
	if e != nil {
		if e.Error() == "not found" {
			err = WrapCaliopenErr(NewCaliopenErr(NotFoundCaliopenErr, "not found"), DbCaliopenErr, "[CassandraBackend]RetrievePubKey not found in db")
		} else {
			err = NewCaliopenErrf(DbCaliopenErr, "[CassandraBackend]RetrievePubKey returned error from cassandra : %s", e.Error())
		}
		return
	}
	pubkey = new(PublicKey)
	pubkey.UnmarshalCQLMap(result)
	return
}

func (cb *CassandraBackend) DeletePubKey(pubkey *PublicKey) CaliopenError {
	e := cb.Session.Query(`DELETE FROM public_key WHERE user_id = ? AND resource_id = ? AND key_id = ?`, pubkey.UserId, pubkey.ResourceId, pubkey.KeyId).Exec()
	if e != nil {
		return NewCaliopenErrf(DbCaliopenErr, "[CassandraBackend]DeletePubKey returned err from cassandra : %s", e.Error())
	}
	return nil
}
