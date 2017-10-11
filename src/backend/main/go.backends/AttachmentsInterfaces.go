package backends

import (
	"io"
)

type AttachmentStorage interface {
	StoreAttachment(attachment_id string, file io.Reader) (uri string, size int, err error)
	GetAttachment(uri string) (file io.Reader, err error)
	DeleteAttachment(uri string) error
}
