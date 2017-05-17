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
		Endpoint  string `mapstructure:"endpoint"`
		AccessKey string `mapstructure:"access_key"`
		SecretKey string `mapstructure:"sercret_key"`
	}
)

func InitializeS3Backend(config S3Config) (s3 S3Backend, err error) {
	s3.S3Config = config
	s3.Client, err = minio.New(config.Endpoint, config.AccessKey, config.SecretKey, false)
	if err != nil {
		s3.Client = nil
		return
	}
	return s3, err
}
