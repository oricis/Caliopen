// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

// constants declares global scope, general usage vars

const (
	// protocols' strings
	EmailProtocol     = "email"
	ImapProtocol      = "imap"
	SmtpProtocol      = "smtp"
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
	Nats_message_tmpl      = "{\"order\":\"%s\", \"message_id\":\"%s\", \"user_id\":\"%s\"}"
	Nats_contact_tmpl      = "{\"order\":\"%s\", \"contact_id\":\"%s\", \"user_id\":\"%s\"}"
	Nats_outSMTP_topicKey  = "outSMTP_topic"
	Nats_inSMTP_topicKey   = "inSMTP_topic"
	Nats_Contacts_topicKey = "contacts_topic"
	Nats_outIMAP_topicKey  = "outIMAP_topic"
	Nats_DiscoverKey_topicKey = "keys_topic"

	//participant types
	ParticipantBcc     = "Bcc"
	ParticipantCC      = "Cc"
	ParticipantFrom    = "From"
	ParticipantReplyTo = "Reply-To"
	ParticipantSender  = "Sender"
	ParticipantTo      = "To"

	//notifications types
	NotifAdminMail     = "adminMail"
	NotifPasswordReset = "passwordReset"

	//identity types
	LocalIdentity  = "local"
	RemoteIdentity = "remote"
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

var DeviceTypes = [5]string{"other", "laptop", "desktop", "smartphone", "tablet"} // always put the default string at first, it will be found by device's func to fill default type.

var EmptyUUID = UUID{} // allocate an emptyUUID that should only be used for testing zero value.
