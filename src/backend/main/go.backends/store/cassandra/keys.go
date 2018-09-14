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
