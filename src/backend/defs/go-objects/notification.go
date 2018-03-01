/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

import "time"

type Notification struct {
	Body            string      `json:"body"`    // could be a simple word or a more complex structure like a json, depending of the notification.
	Emitter         string      `json:"emitter"` // backend entity that's emitting the message
	Id              UUID        `json:"id"`
	InternalPayload interface{} `json:"-"`         // placeholder to put objects needed to build/fulfil notification. Will not be emitted and/or saved.
	Reference       string      `json:"reference"` // (optional) a reference number previously sent by frontend to link current notification to a previous action/event
	Timestamp       time.Time   `json:"timestamp"`
	Type            string      `json:"type"`    // a single word to describe message's type and give indication of importance level (event, info, feedback, warning, teaser, error, alert, etc.)
	TTLcode         string      `json:"-"`       // chars to pickup default duration into notification_ttl table.
	User            *User       `json:"user_id"` // only userId will be exported
}

// model to queue a notification in cassandra
type NotificationModel struct {
	// PRIMARY KEYS (user_id, timestamp_, id)
	Body      string    `cql:"body"`
	Emitter   string    `cql:"emitter"`
	Id        string    `cql:"id"`
	Reference string    `cql:"reference"`
	Timestamp time.Time `cql:"timestamp_"`
	Type      string    `cql:"type"`
	UserId    string    `cql:"user_id"`
}

// model to retrieve default durations for TTLcodes
type NotificationTTL struct {
	// PRIMARY KEY (ttl_code)
	TTLcode     string `cql:"ttl_code"      json:"ttl_code"`
	TTLduration int    `cql:"ttl_duration"  json:"ttl_duration"`
	Description string `cql:"description"   json:"description"`
}

const (
	// types list for Notification.Type property
	EventNotif    = "event"
	InfoNotif     = "info"
	FeedbackNotif = "feedback"
	WarningNotif  = "warning"
	TeaserNotif   = "teaser"
	ErrorNotif    = "error"
	AlertNotif    = "alert"

	// TTL codes stored in notification_ttl table
	ShortLived = "short-lived"
	MidLived   = "mid-lived"
	LongLived  = "long-lived"
	ShortTerm  = "short-term"
	MidTerm    = "mid-term"
	LongTerm   = "long-term"
	Forever    = "forever"
)
