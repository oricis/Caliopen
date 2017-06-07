package REST

func (rest *RESTfacility) SetMessageUnread(user_id, message_id string, status bool) (err error) {

	err = rest.store.SetMessageUnread(user_id, message_id, status)
	if err != nil {
		return err
	}

	err = rest.index.SetMessageUnread(user_id, message_id, status)
	return err
}
