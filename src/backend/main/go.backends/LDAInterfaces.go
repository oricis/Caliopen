// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"io"
)

//LDA only deals with email
type LDAStore interface {
	Close()
	GetMessage(user_id, msg_id string) (msg *Message, err error)
	GetUsersForRecipients([]string) ([]UUID, error) // returns a list of user Ids for each recipients. No deduplicate.
	StoreMessage(msg *Message) error

	StoreRawMessage(msg RawMessage) (err error)

	UpdateMessage(msg *Message, fields map[string]interface{}) error
	LookupContactsByIdentifier(user_id, address string) (contact_ids []string, err error)

	GetAttachment(uri string) (file io.Reader, err error)
	DeleteAttachment(uri string) error
	AttachmentExists(uri string) bool
}

type LDAIndex interface {
	Close()
	UpdateMessage(msg *Message, fields map[string]interface{}) error
	IndexMessage(msg *Message) error
}
