// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type APIStorage interface {
	UserNameStorage
	GetMessage(user_id, msg_id string) (msg *obj.Message, err error)
	GetLocalsIdentities(user_id string) (identities []obj.LocalIdentity, err error)
	SetMessageUnread(user_id, message_id string, status bool) error
}

type APIIndex interface {
	SetMessageUnread(user_id, message_id string, status bool) error
}
