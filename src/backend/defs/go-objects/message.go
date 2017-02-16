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
	User_id                []byte           `cql:"user_id"             json:"-"`
	Message_id             []byte           `cql:"message_id"          json:"message_id"`
	Discussion_id          []byte           `cql:"thread_id"           json:"thread_id"`
	MsgType                string           `cql:"type"                json:"type"`
	From                   string           `cql:"from_"               json:"from_"`
	Date                   time.Time        `cql:"date"                json:"date"`
	Date_insert            time.Time        `cql:"date_insert"         json:"date_insert"`
	Size                   int              `cql:"size"                json:"size"`
	Privacy_index          int              `cql:"privacy_index"       json:"privacy_index"`
	Importance_level       int              `cql:"importance_level"    json:"importance_level"`
	Subject                string           `cql:"subject"             json:"subject"`
	External_msg_id        string           `cql:"external_message_id" json:"external_message_id"`
	External_parent_id     string           `cql:"external_parent_id"  json:"external_parent_id"`
	External_discussion_id string           `cql:"external_thread_id"  json:"external_thread_id"`
	Raw_msg_id             []byte           `cql:"raw_msg_id"          json:"raw_msg_id"`
	Tags                   []string         `cql:"tags"                json:"tags"`
	Flags                  []string         `cql:"flags"               json:"flags"`
	Offset                 int              `cql:"offset"              json:"offset"`
	State                  string           `cql:"state"               json:"state"`
	Recipients             []RecipientModel `cql:"recipients"          json:"recipients"`
	Body                   string           `cql:"text"                json:"text"`
}

type IndexedMessage struct {
	MessageModel
	Headers map[string]string `json:"headers"`
}

type RecipientModel struct {
	RecipientType string `cql:"type"`
	Protocol      string `cql:"protocol"`
	Address       string `cql:"address"`
	Contact_id    []byte `cql:"contact_id"`
	Label         string `cql:"label"`
}
