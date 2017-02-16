// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package email_broker handles codec/decodec between external emails and Caliopen message format
package email_broker

import (
	"bytes"
	"fmt"
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/flashmob/go-guerrilla"
	"github.com/satori/go.uuid"
	"gopkg.in/gomail.v2"
	"io"
	"mime"
	"strings"
	"time"
)

const (
	// QuotedPrintable represents the quoted-printable encoding as defined in
	// RFC 2045.
	QuotedPrintable encoding = "quoted-printable"
	// Base64 represents the base64 encoding as defined in RFC 2045.
	Base64 encoding = "base64"
	// Unencoded can be used to avoid encoding the body of an email. The headers
	// will still be encoded using quoted-printable encoding.
	Unencoded encoding = "8bit"
)

type (
	// EmailMessage is a wrapper to handle the relationship
	// between an email representation and its Caliopen message counterpart
	EmailMessage struct {
		Message *obj.MessageModel
		Email   *Email
	}

	Email struct {
		Components *gomail.Message
		Envelope   *guerrilla.Envelope
	}

	smtpEnvelope struct {
		// Remote IP address
		RemoteAddress string
		// Message sent in EHLO command
		Helo string
		// Sender
		MailFrom *emailAddress
		// Recipients
		RcptTo []emailAddress
		TLS    bool
	}

	// EmailAddress encodes an email address of the form `<user@host>`
	emailAddress struct {
		User string
		Host string
	}

	header map[string][]string

	part struct {
		contentType string
		copier      func(io.Writer) error
		encoding    encoding
	}

	file struct {
		Name     string
		Header   map[string][]string
		CopyFunc func(w io.Writer) error
	}

	// Encoding represents a MIME encoding scheme like quoted-printable or base64.
	encoding string

	mimeEncoder struct {
		mime.WordEncoder
	}
)

// build a 'ready to send' email from a Caliopen message model
// conforms to
// RFC822 / RFC2822 (internet message format)
// RFC2045 / RFC2046 / RFC2047 / RFC2048 / RFC2049 (MIME) => TODO
func MarshalEmail(msg *obj.MessageModel, version string) (e *EmailMessage, err error) {

	m := gomail.NewMessage()

	m.SetHeader("From", msg.From) //TODO: handle the display name when it will be available.

	to, cc, bcc := []string{}, []string{}, []string{}
	for _, rcpt := range msg.Recipients {
		switch rcpt.RecipientType {
		case "to":
			to = append(to, rcpt.Address)
		case "cc":
			cc = append(cc, rcpt.Address)
		case "bcc":
			bcc = append(bcc, rcpt.Address)
		}
	}
	if len(to) > 0 {
		m.SetHeader("To", to...)
	}
	if len(cc) > 0 {
		m.SetHeader("Cc", cc...)
	}
	if len(bcc) > 0 {
		m.SetHeader("Bcc", bcc...)
	}

	m.SetHeader("Date", time.Now().Format(time.RFC1123Z))

	id, err := uuid.FromBytes(msg.Message_id)
	if err != nil {
		log.Warn(err)
		//TODO
	}
	messageId := "<" + id.String() + "@" + strings.Split(msg.From, "@")[1] + ">"

	m.SetHeader("Message-ID", messageId)
	m.SetHeader("X-Mailer", "Caliopen-"+version)

	//TODO: In-Reply-To header
	m.SetHeader("Subject", msg.Subject)
	m.SetBody("text/plain", msg.Body)
	//TODO: errors handling

	e = &EmailMessage{
		Message: msg,
		Email: &Email{
			Components: m,
		},
	}
	return
}

// this func is executed by natsMsgHandler after an email has been passed to the MTA without error
// it flags the caliopen message to 'sent' in cassandra (TODO and elastic ?)
// and stores the raw email
func (b *emailBroker) SaveSentEmail(ack *DeliveryAck) error {
	var raw_email bytes.Buffer
	_, err := ack.EmailMessage.Email.Components.WriteTo(&raw_email)
	if err != nil {
		log.WithError(err).Warn("outbound: storing raw email failed")
		return err
	}
	// save raw email in db
	raw_email_id, err := b.Store.StoreRaw(raw_email.String())
	if err != nil {
		log.WithError(err).Warn("outbound: storing raw email failed")
		return err
	}
	// update caliopen message status
	fields := make(map[string]interface{})
	fields["raw_msg_id"] = raw_email_id
	fields["state"] = "sent"
	fields["date"], _ = time.Parse(time.RFC1123Z, ack.EmailMessage.Email.Components.GetHeader("Date")[0])
	err = b.Store.UpdateMessage(ack.EmailMessage.Message, fields)
	if err != nil {
		log.Warn(err)
	}
	return err
}

func (b *emailBroker) IndexSentEmail(ack DeliveryAck) error {

	return nil
}

func (ep *emailAddress) String() string {
	return fmt.Sprintf("%s@%s", ep.User, ep.Host)
}

func (ep *emailAddress) isEmpty() bool {
	return ep.User == "" && ep.Host == ""
}
