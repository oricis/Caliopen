// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package S3

import (
	"github.com/minio/minio-go"
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type (
	MinioBackend struct {
		S3Config
		Client *minio.Client
	}

	S3Config struct {
		Endpoint  string `mapstructure:"endpoint"`
		AccessKey string `mapstructure:"access_key"`
		SecretKey string `mapstructure:"sercret_key"`
	}

	S3Backend interface {
		PutRawEmail(email_uuid obj.UUID, raw_email string) (uri string, err error)
	}
)

func InitializeS3Backend(config S3Config) (s3 S3Backend, err error) {
	mb := new(MinioBackend)
	mb.S3Config = config
	mb.Client, err = minio.New(config.Endpoint, config.AccessKey, config.SecretKey, false)
	if err != nil {
		mb.Client = nil
		return
	}
	return mb, err
}
