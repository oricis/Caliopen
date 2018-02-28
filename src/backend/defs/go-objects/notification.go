/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

type Notification struct {
	// PRIMARY KEYS (user_id, timestamp, id)
	Body            string      `cql:"body"         json:"body"`
	From            string      `cql:"from_"        json:"from"`
	Id              UUID        `cql:"id"           json:"id"`
	InternalPayload interface{} `cql:"-"            json:"-"` // placeholder to put objects needed to build/fulfil notification. Will not be emitted and/or saved.
	Reference       string      `cql:"reference"    json:"reference"`
	Timestamp       int64       `cql:"timestamp"    json:"timestamp"` // unix time
	To              string      `cql:"to_"          json:"to"`
	Type            string      `cql:"type"         json:"type"`
	User            *User       `cql:"user_id"      json:"user_id"` // only userId will be exported
}
