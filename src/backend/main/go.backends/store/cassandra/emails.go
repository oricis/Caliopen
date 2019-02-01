// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/satori/go.uuid"
)

// GetUsersForLocalMailRecipients is part of LDABackend interface implementation
// return a list of tuples ([user_id, identity_id]) of **local** users found for the given email addresses
func (cb *CassandraBackend) GetUsersForLocalMailRecipients(rcpts []string) (userIds [][]UUID, err error) {
	userIds = [][]UUID{}
	for _, rcpt := range rcpts {
		identities, err := cb.LookupIdentityByIdentifier(rcpt)
		if err == nil {
			for _, identity := range identities {
				if cb.IsLocalIdentity(identity[0], identity[1]) {
					userIds = append(userIds, []UUID{UUID(uuid.FromStringOrNil(identity[0])), UUID(uuid.FromStringOrNil(identity[1]))})
				}
			}
		}
	}
	return
}
