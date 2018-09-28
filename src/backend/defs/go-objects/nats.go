/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

// IMAPfetchOrder is model for message sent on topic 'IMAPfetcher' in NATS's queue 'IMAPworkers'
type IMAPorder struct {
	Order    string
	UserId   string
	RemoteId string
	// optional fields sent by imapctl
	Server   string
	Mailbox  string
	Login    string
	Password string
}

type TwitterOrder struct {
	Order    string
	UserId   string
	RemoteId string
}

// DeliveryAck holds reply from nats when using request/reply system for email
type DeliveryAck struct {
	EmailMessage *EmailMessage `json:"-"`
	Err          bool          `json:"error"`
	Response     string        `json:"message,omitempty"`
}

// a lighter struct to reply to a request
type Ack struct {
	Error    error  `json:"error"`
	Ok       bool   `json:"ok"`
	Response string `json:"message,omitempty"`
}
