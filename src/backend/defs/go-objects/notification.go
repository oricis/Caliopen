/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

import (
	"github.com/gocql/gocql"
	"time"
)

type Notification struct {
	Body            string // could be a simple word or a more complex structure like a json, depending of the notification.
	Emitter         string // backend entity that's emitting the message
	Id              UUID
	InternalPayload interface{} // placeholder to put objects needed to build/fulfil notification. Will not be emitted and/or saved.
	Reference       string      // (optional) a reference number previously sent by frontend to link current notification to a previous action/event
	Timestamp       time.Time
	Type            string // a single word to describe message's type and give indication of importance level (event, info, feedback, warning, teaser, error, alert, etc.)
	TTLcode         string // chars to pickup default duration into notification_ttl table.
	User            *User  // only userId will be exported
}

// model to queue a notification in cassandra or marshal one to json
type NotificationModel struct {
	// PRIMARY KEYS (user_id, timestamp_, id)
	Body      string    `cql:"body"         json:"body"`
	Emitter   string    `cql:"emitter"      json:"emitter"`
	Id        string    `cql:"id"           json:"id"`
	Reference string    `cql:"reference"    json:"reference"`
	Timestamp time.Time `cql:"timestamp_"   json:"timestamp"        formatter:"RFC3339Milli"`
	Type      string    `cql:"type"         json:"type"`
	UserId    string    `cql:"user_id"      json:"user_id"          frontend:"omit"`
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

// return a JSON representation of Device suitable for frontend client
func (n *Notification) MarshalFrontEnd() ([]byte, error) {
	sibling := NotificationModel{
		Body:      n.Body,
		Emitter:   n.Emitter,
		Id:        n.Id.String(),
		Reference: n.Reference,
		Timestamp: n.Timestamp,
		Type:      n.Type,
		UserId:    n.User.UserId.String(),
	}
	return JSONMarshaller("frontend", &sibling)
}

// UnmarshalCQLMap hydrates a Notification with data from a map[string]interface{}
// typical usage is for unmarshaling response from Cassandra backend
func (n *Notification) UnmarshalCQLMap(input map[string]interface{}) {

	if timestamp, ok := input["timestamp_"].(time.Time); ok {
		n.Timestamp = timestamp
	}

	if userId, ok := input["user_id"].(gocql.UUID); ok {
		n.User = &User{}
		n.User.UserId.UnmarshalBinary(userId.Bytes())
	}

	if id, ok := input["id"].(gocql.UUID); ok {
		n.Id.UnmarshalBinary(id.Bytes())
	}

	if body, ok := input["body"].([]byte); ok {
		n.Body = string(body)
	}

	if emitter, ok := input["emitter"].(string); ok {
		n.Emitter = emitter
	}

	if reference, ok := input["reference"].(string); ok {
		n.Reference = reference
	}

	if typ, ok := input["type"].(string); ok {
		n.Type = typ
	}
}
