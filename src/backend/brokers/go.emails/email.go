// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package email_broker handles codec/decodec between external emails and Caliopen message format
package email_broker

import (
	"bytes"
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/satori/go.uuid"
	"gopkg.in/gomail.v2"
	"time"
)

type (
	// EmailMessage is a wrapper to handle the relationship
	// between an email representation and its Caliopen message counterpart
	EmailMessage struct {
		Email   *Email
		Message *obj.MessageModel
	}

	Email struct {
		SmtpMailFrom string       // from or for the smtp agent
		SmtpRcpTo    []string     // from or for the smtp agent
		Raw          bytes.Buffer // raw email (without the Bcc header)
	}
)

// build a 'ready to send' email from a Caliopen message model
// conforms to
// RFC822 / RFC2822 / RFC5322 (internet message format)
// RFC2045 / RFC2046 / RFC2047 / RFC2048 / RFC2049 (MIME) => TODO
func MarshalEmail(msg *obj.MessageModel, version string, mailhost string) (em *EmailMessage, err error) {

	em = &EmailMessage{
		Email: &Email{
			SmtpMailFrom: msg.From,
		},
		Message: msg,
	}

	//make use of gomail library to build the raw email
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
	em.Email.SmtpRcpTo = append(em.Email.SmtpRcpTo, to...)
	em.Email.SmtpRcpTo = append(em.Email.SmtpRcpTo, cc...)
	em.Email.SmtpRcpTo = append(em.Email.SmtpRcpTo, bcc...)
	if len(to) > 0 {
		m.SetHeader("To", to...)
	}
	if len(cc) > 0 {
		m.SetHeader("Cc", cc...)
	}
	if len(bcc) > 0 {
		m.SetHeader("Bcc", bcc...)
	}

	em.Message.Date = time.Now()
	m.SetHeader("Date", em.Message.Date.Format(time.RFC1123Z))

	id, err := uuid.FromBytes(msg.Message_id)
	if err != nil {
		log.Warn(err)
		//TODO
	}
	messageId := "<" + id.String() + "@" + mailhost + ">" // should be the default domain in case there are multiple 'from' addresses

	m.SetHeader("Message-ID", messageId)
	m.SetHeader("X-Mailer", "Caliopen-"+version)

	//TODO: In-Reply-To header
	m.SetHeader("Subject", msg.Subject)
	m.SetBody("text/plain", msg.Body)
	//TODO: errors handling

	m.WriteTo(&em.Email.Raw)
	return
}

// this func is executed by natsMsgHandler after an email has been passed to the MTA without error
// it flags the caliopen message to 'sent' in cassandra (TODO and elastic ?)
// and stores the raw email
func (b *EmailBroker) SaveIndexSentEmail(ack *DeliveryAck) error {

	// save raw email in db
	raw_email_id, err := b.Store.StoreRaw(ack.EmailMessage.Email.Raw.String())
	if err != nil {
		log.WithError(err).Warn("outbound: storing raw email failed")
		return err
	}
	// update caliopen message status
	fields := make(map[string]interface{})
	fields["raw_msg_id"] = raw_email_id
	fields["state"] = "sent"
	fields["date"] = ack.EmailMessage.Message.Date
	err = b.Store.UpdateMessage(ack.EmailMessage.Message, fields)
	if err != nil {
		log.Warn("Store.UpdateMessage operation failed")
	}
	err = b.Index.UpdateMessage(ack.EmailMessage.Message, fields)
	if err != nil {
		log.Warn("Index.UpdateMessage operation failed")
	}
	return err
}
