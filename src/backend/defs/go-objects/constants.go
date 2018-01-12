// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

// constants declares global scope, general usage vars

const (
	// protocols' strings
	EmailProtocol     = "email"
	IrcProtocol       = "irc"
	SmsProtocol       = "sms"
	XmppProtocol      = "xmpp"
	FacebookProtocl   = "facebook"
	TwitterProtocol   = "twitter"
	GnuSocialProtocol = "GNUsocial"
	MastodonProtocol  = "mastodon"

	TimeISO8601      = "2006-01-02T15:04:05-07:00"
	TimeUTCmicro     = "2006-01-02T15:04:05.999999"
	RFC3339Milli     = "2006-01-02T15:04:05.000Z07:00"
	MessageType      = "message"
	ContactType      = "contact"
	MessageIndexType = "indexed_message"
	ContactIndexType = "indexed_contact"

	//nats related constants
	Nats_message_tmpl = "{\"order\":\"%s\", \"message_id\":\"%s\", \"user_id\":\"%s\"}"

	//participant types
	ParticipantBcc     = "Bcc"
	ParticipantCC      = "Cc"
	ParticipantFrom    = "From"
	ParticipantReplyTo = "Reply-To"
	ParticipantSender  = "Sender"
	ParticipantTo      = "To"
)

// A Initiator specifies what kind of actor is triggering a PATCH method on any object
type Initiator int

const (
	Unknown Initiator = iota
	SystemActor
	UserActor
)

// map internal constants to json tags used within struct definition
var Initiators = map[string]Initiator{
	"system": SystemActor,
	"user":   UserActor,
}
