// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package object_store

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/minio/minio-go"
	"io"
)

type (
	MinioBackend struct {
		OSSConfig
		Client *minio.Client
	}

	OSSConfig struct {
		Endpoint         string
		AccessKey        string
		SecretKey        string
		Location         string
		RawMsgBucket     string
		AttachmentBucket string
	}

	ObjectsStore interface {
		PutRawEmail(email_uuid obj.UUID, raw_email string) (uri string, err error)
		PutAttachment(attchId string, attch io.Reader) (uri string, size int64, err error)
		RemoveAttachment(attchId string) error
	}
)

func InitializeObjectsStore(config OSSConfig) (oss ObjectsStore, err error) {
	mb := new(MinioBackend)
	mb.OSSConfig = config

	// Initialize minio client object.
	mb.Client, err = minio.NewWithRegion(config.Endpoint, config.AccessKey, config.SecretKey, false, config.Location)
	// or NewWithCredentials to avoid putting credentials directly into conf. file ?
	if err != nil {
		mb.Client = nil
		return
	}

	// Check to see if we already own RawMsgBucket (which happens if bucket already created by this client)
	exists, err := mb.Client.BucketExists(config.RawMsgBucket)
	if err != nil || !exists {
		// Create a new bucket for raw messages
		err = mb.Client.MakeBucket(config.RawMsgBucket, config.Location)
		if err != nil {
			mb.Client = nil
			return
		}
	}

	// Check to see if we already own AttachmentBucket (which happens if bucket already created by this client)
	exists, err = mb.Client.BucketExists(config.AttachmentBucket)
	if err != nil || !exists {
		// Create a new bucket for raw messages
		err = mb.Client.MakeBucket(config.AttachmentBucket, config.Location)
		if err != nil {
			mb.Client = nil
			return
		}
	}

	return mb, err
}
