// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"time"
)

type RawMessageModel struct {
	Raw_msg_id []byte `cql:"raw_msg_id"`
	Data       string `cql:"data"`
}

type MessageModel struct {
	User_id                []byte           `cql:"user_id"`
	Message_id             []byte           `cql:"message_id"`
	Discussion_id          []byte           `cql:"thread_id"`
	MsgType                string           `cql:"type"`
	From                   string           `cql:"from_"`
	Date                   time.Time        `cql:"date"`
	Date_insert            time.Time        `cql:"date_insert"`
	Size                   int              `cql:"size"`
	Privacy_index          int              `cql:"privacy_index"`
	Importance_level       int              `cql:"importance_level"`
	Subject                string           `cql:"subject"`
	External_msg_id        string           `cql:"external_message_id"`
	External_parent_id     string           `cql:"external_parent_id"`
	External_discussion_id string           `cql:"external_thread_id"`
	Raw_msg_id             []byte           `cql:"raw_msg_id"`
	Tags                   []string         `cql:"tags"`
	Flags                  []string         `cql:"flags"`
	Offset                 int              `cql:"offset"`
	State                  string           `cql:"state"`
	Recipients             []RecipientModel `cql:"recipients"`
	Body                   string           `cql:"text"`
}

type RecipientModel struct {
	RecipientType string `cql:"type"`
	Protocol      string `cql:"protocol"`
	Address       string `cql:"address"`
	Contact_id    []byte `cql:"contact_id"`
	Label         string `cql:"label"`
}
