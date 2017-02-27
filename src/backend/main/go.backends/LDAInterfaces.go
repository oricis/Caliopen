// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"

type LDABackend interface {
	GetRecipients([]string) ([]string, error)
	StoreRaw(data string) (raw_id string, err error)
	GetMessage(user_id, msg_id string) (msg *objects.MessageModel, err error)
	UpdateMessage(msg *objects.MessageModel, fields map[string]interface{}) error
}
