// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
		"github.com/gocql/gocql"
)

// user settings
type Settings struct {
	ContactDisplayFormat string `cql:"contact_display_format"	json:"contact_display_format"`
	ContactDisplayOrder string `cql:"contact_display_order"	json:"contact_display_order"`
	DefaultLocale    string `cql:"default_locale"      json:"default_locale"`
	MessageDisplayFormat 	string `cql:"message_display_format"	json:"message_display_format"`
	NotificationDelayDisappear int `cql:"notification_delay_disappear"	json:"notification_delay_disappear"`
	NotificationEnabled bool `cql:"notification_enabled"	json:"notification_enabled"`
	NotificationMessagePreview string `cql:"notification_message_preview"	json:"notification_message_preview"`
	NotificationSoundEnabled bool `cql:"notification_sound_enabled"	json:"notification_sound_enabled"`
	UserId          UUID              `cql:"user_id"            json:"user_id"`
}


// unmarshal a map[string]interface{} that must owns all Settings's fields
// typical usage is for unmarshaling response from Cassandra backend
func (settings *Settings) UnmarshalCQLMap(input map[string]interface{}) {
	settings.DefaultLocale = input["default_locale"].(string)
	settings.ContactDisplayOrder = input["contact_display_order"].(string)
	settings.ContactDisplayFormat = input["contact_display_format"].(string)
	settings.MessageDisplayFormat = input["message_display_format"].(string)
	settings.NotificationDelayDisappear = input["notification_delay_disappear"].(int)
	settings.NotificationEnabled = input["notification_enabled"].(bool)
	settings.NotificationSoundEnabled = input["notification_sound_enabled"].(bool)
	settings.NotificationMessagePreview = input["notification_message_preview"].(string)
	userid, _ := input["user_id"].(gocql.UUID)
	settings.UserId.UnmarshalBinary(userid.Bytes())
}
