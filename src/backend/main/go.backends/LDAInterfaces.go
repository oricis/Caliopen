// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"

//LDA only deals with email
type LDAStore interface {
	Close()
	GetMessage(user_id, msg_id string) (msg *objects.Message, err error)
	GetUsersForRecipients([]string) ([]objects.UUID, error) // returns a list of user Ids for each recipients. No deduplicate.
	StoreMessage(msg *objects.Message) error

	//store raw email
	StoreRaw(data string) (raw_id string, err error)

	UpdateMessage(msg *objects.Message, fields map[string]interface{}) error
	LookupContactsByIdentifier(user_id, address string) (contact_ids []string, err error)
}

type LDAIndex interface {
	Close()
	UpdateMessage(msg *objects.Message, fields map[string]interface{}) error
	IndexMessage(msg *objects.Message) error
}
