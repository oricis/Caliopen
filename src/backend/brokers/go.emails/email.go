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
	"io/ioutil"
	"net/mail"
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

	messageId := "<" + msg.Message_id.String() + "@" + mailhost + ">" // should be the default domain in case there are multiple 'from' addresses

	m.SetHeader("Message-ID", messageId)
	m.SetHeader("X-Mailer", "Caliopen-"+version)

	//TODO: In-Reply-To header
	m.SetHeader("Subject", msg.Subject)
	m.SetBody("text/plain", msg.Body)
	//TODO: errors handling

	m.WriteTo(&em.Email.Raw)
	return
}

// executed by natsMsgHandler after an outgoing email has been transmitted to the MTA without error
// it flags the caliopen message to 'sent' in cassandra
// and stores the raw outbound email
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
	fields["state"] = obj.EmailStateSent
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

// gets a raw email and transforms into a Caliopen 'message' object
// belonging to an user
func (b *EmailBroker) UnmarshalEmail(em *EmailMessage, user_id obj.CaliopenUUID) (msg *obj.MessageModel, err error) {

	parsed_mail, err := mail.ReadMessage(&em.Email.Raw)
	if err != nil {
		log.Warn("unable to parse email with raw_id : %s", em.Message.Raw_msg_id)
		return nil, err
	}

	mail_date, err := parsed_mail.Header.Date()
	if err != nil {
		log.WithError(err).Warn("unable to parse email's date")
	}

	var mail_rcpts []obj.RecipientModel
	mail_from, _ := b.unmarshalRecipients(parsed_mail.Header, "from", user_id)
	mail_to, _ := b.unmarshalRecipients(parsed_mail.Header, "to", user_id)
	mail_cc, _ := b.unmarshalRecipients(parsed_mail.Header, "cc", user_id)
	mail_rcpts = append(mail_rcpts, mail_from...)
	mail_rcpts = append(mail_rcpts, mail_to...)
	mail_rcpts = append(mail_rcpts, mail_cc...)

	mail_body, err := ioutil.ReadAll(parsed_mail.Body)
	if err != nil {
		log.WithError(err).Warn("unable to parse email's body")
	}

	var m_id obj.CaliopenUUID
	m_id.UnmarshalBinary(uuid.NewV4().Bytes())
	msg = &obj.MessageModel{
		User_id:     user_id,
		Message_id:  m_id,
		MsgType:     obj.EmailProtocol,
		From:        parsed_mail.Header.Get("from"),
		Date:        mail_date,
		Date_insert: time.Now(),
		Subject:     parsed_mail.Header.Get("subject"),
		Recipients:  mail_rcpts,
		Body:        string(mail_body),
		Raw_msg_id:  em.Message.Raw_msg_id,
	}

	return
}

// if an user_id is provided, the func will try to find a matching contact for each recipient within user's contactbook in db
// otherwise, contact_id will be nil for recipient
func (b *EmailBroker) unmarshalRecipients(h mail.Header, address_type string, user_id ...obj.CaliopenUUID) (recipients []obj.RecipientModel, err error) {
	recipients = []obj.RecipientModel{}
	addresses, err := h.AddressList(address_type)
	if err != nil {
		return recipients, err
	}
	for _, a := range addresses {
		rcpt := obj.RecipientModel{
			RecipientType: address_type,
			Protocol:      obj.EmailProtocol,
			Address:       a.Address,
			Label:         a.Name,
			Contact_id:    obj.CaliopenUUID{},
		}
		if len(user_id) == 1 {
			contact_id, err := b.Store.LookupContactByIdentifier(user_id[0].String(), a.Address)
			if err == nil {
				uuid, _ := uuid.FromString(contact_id)
				rcpt.Contact_id.UnmarshalBinary(uuid.Bytes())
			}
		}
		recipients = append(recipients, rcpt)
	}

	return
}
