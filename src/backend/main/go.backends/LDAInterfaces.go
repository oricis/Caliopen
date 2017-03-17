// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"

type LDAStore interface {
	Close()
	GetMessage(user_id, msg_id string) (msg *objects.MessageModel, err error)
	GetUsersForRecipients([]string) ([]objects.CaliopenUUID, error) // returns a list of user Ids for each recipients. No deduplicate.
	StoreMessage(msg *objects.MessageModel) error
	StoreRaw(data string) (raw_id string, err error)
	UpdateMessage(msg *objects.MessageModel, fields map[string]interface{}) error
	LookupContactByIdentifier(user_id, address string) (contact_id string, err error)
}

type LDAIndex interface {
	Close()
	UpdateMessage(msg *objects.MessageModel, fields map[string]interface{}) error
	IndexMessage(msg *objects.MessageModel) error
}
