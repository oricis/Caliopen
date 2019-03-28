// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	"io"
)

type AttachmentStore struct{}

func (as AttachmentStore) StoreAttachment(attachment_id string, file io.Reader) (uri string, size int, err error) {
	return "", 0, errors.New("test interface not implemented")
}
func (as AttachmentStore) GetAttachment(uri string) (file io.Reader, err error) {
	return nil, errors.New("test interface not implemented")
}
func (as AttachmentStore) DeleteAttachment(uri string) error {
	return errors.New("test interface not implemented")
}
