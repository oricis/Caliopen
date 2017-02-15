// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen_smtp

import (
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/satori/go.uuid"
	"gopkg.in/gomail.v2"
	"strings"
	log "github.com/Sirupsen/logrus"
	"time"
	"bytes"
)

// a wrapper around gomail.Message type to
// handle the relationship between the email and its Caliopen message parent
type Email struct {
	mail    *gomail.Message
	message *obj.MessageModel
}

// build a 'ready to send' email from a Caliopen message model
// conforms to
// RFC822 / RFC2822 (internet message format)
// RFC2045 / RFC2046 / RFC2047 / RFC2048 / RFC2049 (MIME) => TODO
func MarshalEmail(msg *obj.MessageModel, version string) (e *Email, err error) {
	e = &Email{
		mail:    gomail.NewMessage(),
		message: msg,
	}

	//TODO: handle the display name when it will be available.
	e.mail.SetHeader("From", msg.From)

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
		e.mail.SetHeader("To", to...)
	}
	if len(cc) > 0 {
		e.mail.SetHeader("Cc", cc...)
	}
	if len(bcc) > 0 {
		e.mail.SetHeader("Bcc", bcc...)
	}

	e.mail.SetHeader("Date", time.Now().Format(time.RFC1123Z))

	id, err := uuid.FromBytes(msg.Message_id)
	if err != nil {
		log.Warn(err)
		//TODO
	}
	messageId := "<" + id.String() + "@" + strings.Split(msg.From, "@")[1] + ">"

	e.mail.SetHeader("Message-ID", messageId)
	e.mail.SetHeader("X-Mailer", "Caliopen-" + version)

	//TODO: In-Reply-To header
	e.mail.SetHeader("Subject", msg.Subject)
	e.mail.SetBody("text/plain", msg.Body)
	//TODO: errors handling

	return
}


// this func is executed by natsMsgHandler after an email has been passed to the MTA without error
// it flags the caliopen message to 'sent' in cassandra (TODO and elastic ?)
// and stores the raw email
func (agent *OutAgent) SaveSentEmail(ack deliveryAck) error {
	var raw_email bytes.Buffer
	_, err := ack.email.mail.WriteTo(&raw_email)
	if err != nil {
		log.WithError(err).Warn("outbound: storing raw email failed")
		return err
	}
	// save raw email in db
	raw_email_id, err := agent.Backend.StoreRaw(raw_email.String())
	if err != nil {
		log.WithError(err).Warn("outbound: storing raw email failed")
		return err
	}
	// update caliopen message status
	fields := make(map[string]interface{})
	fields["raw_msg_id"] = raw_email_id
	fields["state"] = "sent"
	fields["date"], _ = time.Parse(time.RFC1123Z, ack.email.mail.GetHeader("Date")[0])
	err = agent.Backend.UpdateMessage(ack.email.message, fields)
	if err != nil {
		log.Warn(err)
	}
	return err
}
