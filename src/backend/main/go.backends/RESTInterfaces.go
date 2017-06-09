// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"io"
)

type APIStorage interface {
	UserNameStorage
	GetMessage(user_id, msg_id string) (msg *Message, err error)
	UpdateMessage(msg *Message, fields map[string]interface{}) error
	GetLocalsIdentities(user_id string) (identities []LocalIdentity, err error)
	SetMessageUnread(user_id, message_id string, status bool) error
	StoreAttachment(attachment_id string, file io.Reader) (uri string, size int, err error)
	GetAttachment(uri string) (file io.Reader, err error)
	DeleteAttachment(uri string) error
	GetRawMessage(user_id, message_id string) (message string, err error)
}

type APIIndex interface {
	SetMessageUnread(user_id, message_id string, status bool) error
	UpdateMessage(msg *Message, fields map[string]interface{}) error
}
