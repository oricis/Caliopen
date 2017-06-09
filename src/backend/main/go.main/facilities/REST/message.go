package REST

import (
	"io"
	"strings"
)

func (rest *RESTfacility) SetMessageUnread(user_id, message_id string, status bool) (err error) {

	err = rest.store.SetMessageUnread(user_id, message_id, status)
	if err != nil {
		return err
	}

	err = rest.index.SetMessageUnread(user_id, message_id, status)
	return err
}

func (rest *RESTfacility) OpenRawMessage(user_id, message_id string) (content io.ReadSeeker, err error) {
	rawMessage, err := rest.store.GetRawMessage(user_id, message_id)
	if err != nil {
		return nil, err
	}
	r := strings.NewReader(rawMessage)
	content = io.NewSectionReader(r, 0, int64(len(rawMessage)))
	return
}

func (rest *RESTfacility) GetRawMessage(user_id, message_id string) (content io.ReadSeeker, err error) {

	return
}
