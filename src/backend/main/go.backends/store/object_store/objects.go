// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package object_store

import (
	"fmt"
	"github.com/minio/minio-go"
	"io"
	"net/url"
)

func (mb *MinioBackend) PutObject(name, bucket string, object io.Reader) (uri string, size int64, err error) {
	const uriTemplate = "s3://%s/%s"

	size, err = mb.Client.PutObject(bucket, name, object, -1, minio.PutObjectOptions{ContentType: "application/octet-stream"})
	if err != nil {
		return "", 0, err
	}

	return fmt.Sprintf(uriTemplate, bucket, name), size, nil
}

func (mb *MinioBackend) RemoveObject(objURI string) error {
	uri, err := url.Parse(objURI)
	if err != nil || len(uri.Host) < 1 || len(uri.Path) < 2 {
		return err
	}
	return mb.Client.RemoveObject(uri.Host, uri.Path[1:])
}

func (mb *MinioBackend) GetObject(objURI string) (file io.Reader, err error) {
	uri, err := url.Parse(objURI)
	if err != nil || len(uri.Host) < 1 || len(uri.Path) < 2 {
		return nil, err
	}
	return mb.Client.GetObject(uri.Host, uri.Path[1:], minio.GetObjectOptions{})
}

func (mb *MinioBackend) StatObject(objURI string) (info minio.ObjectInfo, err error) {
	uri, err := url.Parse(objURI)
	if err != nil || len(uri.Host) < 1 || len(uri.Path) < 2 {
		return
	}
	return mb.Client.StatObject(uri.Host, uri.Path[1:], minio.StatObjectOptions{})
}
