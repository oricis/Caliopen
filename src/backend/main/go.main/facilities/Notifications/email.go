// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Notifications

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/CaliOpen/Caliopen/src/backend/brokers/go.emails"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/satori/go.uuid"
	"time"
)

type EmailNotifiers interface {
	SendEmailAdminToUser(user *User, email *Message) error
	SendPasswordResetEmail(session *Pass_reset_session) error
}

// SendEmailAdminToUser sends an administrative email to user, ie :
// this is an email composed by the backend to inform user that something happened related to its account
// func is in charge of saving & indexing draft before sending the "deliver" order to the SMTP broker.
func (fac *Facility) SendEmailAdminToUser(user *User, email *Message) error {
	log.Infof("[NotificationsFacility] Password has been changed for user <%s> [%s] via REST API", user.Name, user.UserId.String())
	if fac.admin == nil {
		err := errors.New("[NotificationsFacility] can't SendEmailAdminToUser, no admin user has been set")
		log.Warn(err)
		return err
	}

	// should create a draft then send it via apiV1

	sender := Participant{
		Address:  fac.admin.RecoveryEmail,
		Label:    fac.admin.Name,
		Protocol: EmailProtocol,
		Type:     ParticipantFrom,
	}
	recipient := Participant{
		Address:     user.RecoveryEmail,
		Contact_ids: []UUID{user.ContactId},
		Label:       user.Name,
		Protocol:    EmailProtocol,
		Type:        ParticipantTo,
	}
	now := time.Now()
	(*email).Date = now
	(*email).Date_insert = now
	(*email).Message_id.UnmarshalBinary(uuid.NewV4().Bytes())
	(*email).Is_draft = true
	(*email).Participants = []Participant{sender, recipient}
	(*email).Type = EmailProtocol
	(*email).User_id = fac.admin.UserId

	// need to create discussion

	err := fac.store.CreateMessage(email)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser failed to store draft")
		return err
	}
	err = fac.index.CreateMessage(email)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser failed to index draft")
		return err
	}

	const nats_order = "deliver"
	natsMessage := fmt.Sprintf(Nats_message_tmpl, nats_order, email.Message_id.String(), fac.admin.UserId.String())
	rep, err := fac.queue.Request(fac.nats_outSMTP_topic, []byte(natsMessage), 30*time.Second)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
		if fac.queue.LastError() != nil {
			log.WithError(fac.queue.LastError()).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
			return err
		}
		return err
	}
	var reply email_broker.DeliveryAck
	err = json.Unmarshal(rep.Data, &reply)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
		return err
	}
	if reply.Err {
		err := errors.New(reply.Response)
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
		return err
	}
	return nil
}

func (fac *Facility) SendPasswordResetEmail(session *Pass_reset_session) error {
	log.Infof("%+v", session)
	return errors.New("not implemented")
}