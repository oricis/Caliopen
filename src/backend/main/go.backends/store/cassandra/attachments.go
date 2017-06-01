// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package store

import "io"

func (cb *CassandraBackend) StoreAttachment(attachment_id string, file io.Reader) (uri string, size int, err error) {
	return cb.ObjectsStore.PutAttachment(attachment_id, file)
}

func (cb *CassandraBackend) DeleteAttachment(uri string) error {
	return cb.ObjectsStore.RemoveAttachment(uri)
}
