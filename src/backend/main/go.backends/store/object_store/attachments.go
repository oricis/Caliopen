// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package object_store

import (
	"io"
)

func (mb *MinioBackend) PutAttachment(attchId string, attch io.Reader) (uri string, size int64, err error) {
	return mb.PutObject(attchId, mb.AttachmentBucket, attch)
}
