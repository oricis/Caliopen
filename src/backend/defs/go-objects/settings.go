// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
)

// user settings
type Settings struct {
	ContactDisplayFormat       string `cql:"contact_display_format"	json:"contact_display_format"`
	ContactDisplayOrder        string `cql:"contact_display_order"	json:"contact_display_order"`
	DefaultLocale              string `cql:"default_locale"      json:"default_locale"`
	MessageDisplayFormat       string `cql:"message_display_format"	json:"message_display_format"`
	NotificationDelayDisappear int    `cql:"notification_delay_disappear"	json:"notification_delay_disappear"`
	NotificationEnabled        bool   `cql:"notification_enabled"	json:"notification_enabled"`
	NotificationMessagePreview string `cql:"notification_message_preview"	json:"notification_message_preview"`
	NotificationSoundEnabled   bool   `cql:"notification_sound_enabled"	json:"notification_sound_enabled"`
	UserId                     UUID   `cql:"user_id"            json:"user_id"`
}

// unmarshal a map[string]interface{} that must owns all Settings's fields
// typical usage is for unmarshaling response from Cassandra backend
func (s *Settings) UnmarshalCQLMap(input map[string]interface{}) {
	s.ContactDisplayOrder = input["contact_display_order"].(string)
	s.ContactDisplayFormat = input["contact_display_format"].(string)
	s.DefaultLocale = input["default_locale"].(string)
	s.MessageDisplayFormat = input["message_display_format"].(string)
	s.NotificationDelayDisappear = input["notification_delay_disappear"].(int)
	s.NotificationEnabled = input["notification_enabled"].(bool)
	s.NotificationSoundEnabled = input["notification_sound_enabled"].(bool)
	s.NotificationMessagePreview = input["notification_message_preview"].(string)
	userid, _ := input["user_id"].(gocql.UUID)
	s.UserId.UnmarshalBinary(userid.Bytes())
}

func (s *Settings) UnmarshalMap(input map[string]interface{}) error {
	if contactDisplayOrder, ok := input["contact_display_order"].(string); ok {
		s.ContactDisplayOrder = contactDisplayOrder
	}
	if contactDisplayFormat, ok := input["contact_display_format"].(string); ok {
		s.ContactDisplayFormat = contactDisplayFormat
	}
	if defaultLocale, ok := input["default_locale"].(string); ok {
		s.DefaultLocale = defaultLocale
	}
	if messageDisplayFormat, ok := input["message_display_format"].(string); ok {
		s.MessageDisplayFormat = messageDisplayFormat
	}
	if delay, ok := input["notification_delay_disappear"].(float64); ok {
		s.NotificationDelayDisappear = int(delay)
	}
	if notificationEnabled, ok := input["notification_enabled"].(bool); ok {
		s.NotificationEnabled = notificationEnabled
	}
	if notificationSoundEnabled, ok := input["notification_sound_enabled"].(bool); ok {
		s.NotificationSoundEnabled = notificationSoundEnabled
	}
	if notificationMessagePreview, ok := input["notification_message_preview"].(string); ok {
		s.NotificationMessagePreview = notificationMessagePreview
	}
	if userID, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userID); err == nil {
			s.UserId.UnmarshalBinary(id.Bytes())
		}
	}
	return nil
}

func (s *Settings) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return s.UnmarshalMap(input)
}

func (*Settings) NewEmpty() interface{} {
	return new(Settings)
}

func (s *Settings) JsonTags() map[string]string {
	return jsonTags(s)
}
