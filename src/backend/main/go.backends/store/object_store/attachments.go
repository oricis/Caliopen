// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package object_store

import (
	"fmt"
	"io"
	"net/url"
)

func (mb *MinioBackend) PutAttachment(attchId string, attch io.Reader) (uri string, size int64, err error) {
	const uriTemplate = "s3://%s/%s"

	size, err = mb.Client.PutObject(mb.AttachmentBucket, attchId, attch, "application/octet-stream")
	if err != nil {
		return "", 0, err
	}

	return fmt.Sprintf(uriTemplate, mb.AttachmentBucket, attchId), size, nil
}

func (mb *MinioBackend) RemoveAttachment(attchURI string) error {
	uri, err := url.Parse(attchURI)
	if err != nil {
		return err
	}
	return mb.Client.RemoveObject(uri.Host, uri.Path[1:])
}
