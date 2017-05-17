// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package S3

import (
	"github.com/minio/minio-go"
)

type (
	S3Backend struct {
		S3Config
		Client *minio.Client
	}

	S3Config struct {
	}
)

func InitializeS3Backend(config S3Config) (s3 *S3Backend, err error) {

	return
}
