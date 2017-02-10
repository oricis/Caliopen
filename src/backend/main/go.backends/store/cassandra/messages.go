// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.


//low level implementation for now
package store

import (
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
)

const (
	getMessageQuery = `
	SELECT
	user_id,
	message_id,
	thread_id,
	type,
	from_,
	date,
	date_insert,
	size,
	privacy_index,
	importance_level,
	subject,
	external_message_id,
	external_parent_id,
	external_thread_id,
	raw_msg_id,
	tags,
	flags,
	offset,
	state,
	recipients,
	text
	FROM message WHERE user_id = ? and message_id = ?
	`
)

func (cb *CassandraBackend) GetMessage(user_id, msg_id string) (msg *objects.MessageModel, err error) {

	var m objects.MessageModel

	err = cb.Session.Query(getMessageQuery, user_id, msg_id).Scan(
		&m.User_id,
		&m.Message_id,
		&m.Discussion_id,
		&m.MsgType,
		&m.From,
		&m.Date,
		&m.Date_insert,
		&m.Size,
		&m.Privacy_index,
		&m.Importance_level,
		&m.Subject,
		&m.External_msg_id,
		&m.External_parent_id,
		&m.External_discussion_id,
		&m.Raw_msg_id,
		&m.Tags,
		&m.Flags,
		&m.Offset,
		&m.State,
		&m.Recipients,
		&m.Body,
	)
	if err != nil {
		return nil, err
	}

	msg = &m
	return
}
