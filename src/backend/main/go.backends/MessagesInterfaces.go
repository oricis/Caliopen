package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type MessageStorage interface {
	GetMessage(user_id, msg_id string) (msg *Message, err error)
	UpdateMessage(msg *Message, fields map[string]interface{}) error
	SetMessageUnread(user_id, message_id string, status bool) error
	GetRawMessage(raw_message_id string) (raw_message RawMessage, err error)
}
