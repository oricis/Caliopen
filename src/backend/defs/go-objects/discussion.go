// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/satori/go.uuid"
	"time"
)

type (
	Discussion struct {
		AttachmentCount    int32         `json:"attachment_count"`
		DateInsert         time.Time     `json:"date_insert"              formatter:"RFC3339Milli"`
		DateUpdate         time.Time     `json:"date_update"`
		DiscussionId       UUID          `json:"discussion_id"            formatter:"rfc4122"`
		Excerpt            string        `json:"excerpt"`
		ImportanceLevel    int32         `json:"importance_level"`
		LastMessageDate    time.Time     `json:"last_message_date"`
		LastMessageId      UUID          `json:"last_message_id"`
		LastMessageSubject string        `json:"last_message_subject"`
		MessagesHash       string        `json:"messages_hash"`
		Participants       []Participant `json:"participants"`
		Protocol           string        `json:"protocol"`
		Subject            string        `json:"subject"`
		Tags               []string      `json:"tags"`
		TotalCount         int32         `json:"total_count"`
		UnreadCount        int32         `json:"unread_count"`
		UserId             UUID          `json:"user_id"`
	}
)

func (d *Discussion) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return d.UnmarshalMap(input)
}

// UnmarshalMap hydrates a Discussion with data from map[string]interface{}
func (d *Discussion) UnmarshalMap(input map[string]interface{}) error {
	if attachmentCount, ok := input["attachment_count"].(float64); ok {
		d.AttachmentCount = int32(attachmentCount)
	}
	if dateInsert, ok := input["date_insert"].(string); ok {
		d.DateInsert, _ = time.Parse(time.RFC3339Nano, dateInsert)
	}
	if dateUpdate, ok := input["date_update"].(string); ok {
		d.DateUpdate, _ = time.Parse(time.RFC3339Nano, dateUpdate)
	}
	if discId, ok := input["discussion_id"].(string); ok {
		if id, err := uuid.FromString(discId); err == nil {
			d.DiscussionId.UnmarshalBinary(id.Bytes())
		}
	}
	if excerpt, ok := input["excerpt"].(string); ok {
		d.Excerpt = excerpt
	}
	if il, ok := input["importance_level"].(float64); ok {
		d.ImportanceLevel = int32(il)
	}
	if lastMsgDate, ok := input["last_message_date"].(string); ok {
		d.LastMessageDate, _ = time.Parse(time.RFC3339Nano, lastMsgDate)
	}
	if lastMsgId, ok := input["last_message_id"].(string); ok {
		if id, err := uuid.FromString(lastMsgId); err == nil {
			d.LastMessageId.UnmarshalBinary(id.Bytes())
		}
	}
	if msgHash, ok := input["messages_hash"].(string); ok {
		d.MessagesHash = msgHash
	}
	if participants, ok := input["participants"]; ok && participants != nil {
		d.Participants = []Participant{}
		for _, participant := range participants.([]interface{}) {
			P := new(Participant)
			if err := P.UnmarshalMap(participant.(map[string]interface{})); err == nil {
				d.Participants = append(d.Participants, *P)
			}
		}
	}
	if protocol, ok := input["protocol"].(string); ok {
		d.Protocol = protocol
	}
	if subject, ok := input["subject"].(string); ok {
		d.Subject = subject
	}
	if tags, ok := input["tags"]; ok && tags != nil {
		d.Tags = []string{}
		for _, tag := range tags.([]interface{}) {
			d.Tags = append(d.Tags, tag.(string))
		}
	}
	if totalCount, ok := input["total_count"].(float64); ok {
		d.TotalCount = int32(totalCount)
	}
	if unreadCount, ok := input["unread_count"].(float64); ok {
		d.UnreadCount = int32(unreadCount)
	}
	if userId, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userId); err == nil {
			d.UserId.UnmarshalBinary(id.Bytes())
		}
	}
	return nil
}

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaler takes account of custom tags for given 'context'
func (d *Discussion) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", d)
}

// return a JSON representation of Message suitable for frontend client
func (d *Discussion) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", d)
}

// MarshallNew implements CaliopenObject interface
func (d *Discussion) MarshallNew(args ...interface{}) {
	if len(d.DiscussionId) == 0 || (bytes.Equal(d.DiscussionId.Bytes(), EmptyUUID.Bytes())) {
		d.DiscussionId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if len(d.UserId) == 0 || (bytes.Equal(d.UserId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				d.UserId = args[0].(UUID)
			}
		}
	}

	if d.DateInsert.IsZero() {
		d.DateInsert = time.Now()
	}
}
