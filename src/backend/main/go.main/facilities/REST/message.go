// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

func (rest *RESTfacility) SetMessageUnread(user_id, message_id string, status bool) (err error) {

	err = rest.store.SetMessageUnread(user_id, message_id, status)
	if err != nil {
		return err
	}

	err = rest.index.SetMessageUnread(user_id, message_id, status)
	return err
}

func (rest *RESTfacility) GetRawMessage(raw_message_id string) (raw_message []byte, err error) {
	raw_msg, err := rest.store.GetRawMessage(raw_message_id)
	if err != nil {
		return
	}
	return []byte(raw_msg.Raw_data), nil
}
