// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package object_store

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/minio/minio-go"
)

type (
	MinioBackend struct {
		S3Config
		Client *minio.Client
	}

	S3Config struct {
		Endpoint       string
		AccessKey      string
		SecretKey      string
		RawMsgLocation string
		RawMsgBucket   string
	}

	S3Backend interface {
		PutRawEmail(email_uuid obj.UUID, raw_email string) (uri string, err error)
	}
)

func InitializeS3Backend(config S3Config) (s3 S3Backend, err error) {
	mb := new(MinioBackend)
	mb.S3Config = config

	// Initialize minio client object.
	mb.Client, err = minio.NewWithRegion(config.Endpoint, config.AccessKey, config.SecretKey, false, config.RawMsgLocation)
	// or NewWithCredentials to avoid putting credentials directly into conf. file ?
	if err != nil {
		mb.Client = nil
		return
	}

	// Check to see if we already own this bucket (which happens if bucket already created by this client)
	exists, err := mb.Client.BucketExists(config.RawMsgBucket)
	if err != nil || !exists {
		// Create a new bucket for raw messages
		err = mb.Client.MakeBucket(config.RawMsgBucket, config.RawMsgLocation)
		if err != nil {
			mb.Client = nil
			return
		}
	}

	return mb, err
}
