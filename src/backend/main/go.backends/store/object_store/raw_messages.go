// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package object_store

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"strings"
)

func (mb *MinioBackend) PutRawMessage(message_uuid obj.UUID, raw_email string) (uri string, err error) {
	email_reader := strings.NewReader(raw_email)
	uri, _, err = mb.PutObject(message_uuid.String(), mb.RawMsgBucket, email_reader)
	return
}
