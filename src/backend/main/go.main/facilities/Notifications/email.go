// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Notifications

import (
	"encoding/json"
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/satori/go.uuid"
	"time"
)

type EmailNotifiers interface {
	SendEmailAdminToUser(user *User, email *Message) error
	SendPasswordResetEmail(user *User, session *Pass_reset_session) error
}

const (
	resetPasswordTemplate = "email-reset-password-link.yaml"
	resetLinkFmt          = "%s/auth/passwords/reset/%s"
)

// ByEmail notifies an user by the mean of an email.
func (N *Notifier) ByEmail(notif *Notification) CaliopenError {
	N.LogNotification("ByEmail", notif)
	switch notif.Type {
	case NotifAdminMail:
		N.SendEmailAdminToUser(notif.User, notif.InternalPayload.(*Message))
	case NotifPasswordReset:
		N.SendPasswordResetEmail(notif.User, notif.InternalPayload.(*Pass_reset_session))
	default:
		return NewCaliopenErrf(UnprocessableCaliopenErr, "[Notifier]ByEmail : unknown notification type <%s>", notif.Type)
	}
	return nil
}

// SendEmailAdminToUser sends an administrative email to user, ie :
// this is an email composed by the backend to inform user that something happened related to its account
// func is in charge of saving & indexing draft before sending the "deliver" order to the SMTP broker.
func (notif *Notifier) SendEmailAdminToUser(user *User, email *Message) error {
	if notif.admin == nil {
		err := errors.New("[NotificationsFacility] can't SendEmailAdminToUser, no admin user has been set")
		log.Warn(err)
		return err
	}

	sender := Participant{
		Address:  (*notif.adminLocalID).Identifier,
		Label:    (*notif.adminLocalID).DisplayName,
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
	(*email).Discussion_id.UnmarshalBinary(uuid.NewV4().Bytes())
	(*email).Is_draft = true
	(*email).Participants = []Participant{sender, recipient}
	(*email).Protocol = EmailProtocol
	(*email).User_id = notif.admin.UserId
	(*email).UserIdentities = []UUID{notif.adminLocalID.Id}

	// save & index message
	err := notif.store.CreateMessage(email)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser failed to store draft")
		return err
	}
	user_info := &UserInfo{User_id: notif.admin.UserId.String(), Shard_id: notif.admin.ShardId}
	err = notif.index.CreateMessage(user_info, email)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser failed to index draft")
		return err
	}

	log.Infof("[NotificationsFacility] sending email admin for user <%s> [%s]", user.Name, user.UserId.String())
	const nats_order = "deliver"

	order := BrokerOrder{
		Order:      nats_order,
		MessageId:  email.Message_id.String(),
		UserId:     notif.admin.UserId.String(),
		IdentityId: notif.adminLocalID.Id.String(),
	}
	natsMessage, e := json.Marshal(order)
	if e != nil {
		return fmt.Errorf("[EmailNotifiers] failed to build nats message : %s", e.Error())
	}
	rep, err := notif.natsQueue.Request(notif.natsTopics[Nats_outSMTP_topicKey], natsMessage, 30*time.Second)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
		if notif.natsQueue.LastError() != nil {
			log.WithError(notif.natsQueue.LastError()).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
			return err
		}
		return err
	}
	var reply DeliveryAck
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

func (notif *Notifier) SendPasswordResetEmail(user *User, session *Pass_reset_session) error {
	if user == nil || session == nil {
		return errors.New("[NotificationsFacility] SendPasswordResetEmail invalid params")
	}

	reset_link := fmt.Sprintf(resetLinkFmt, notif.config.BaseUrl, session.Reset_token)
	context := map[string]interface{}{
		"given_name":  user.GivenName,
		"family_name": user.FamilyName,
		"domain":      notif.config.BaseUrl,
		"url":         reset_link,
	}
	email, err := RenderResetEmail(notif.config.TemplatesPath+resetPasswordTemplate, context)
	if err != nil {
		log.WithError(err).Warnf("[RESTfacility] failed to build reset email from template for user %s", user.UserId.String())
		return errors.New("[RESTfacility] failed to build reset email")
	}

	err = notif.SendEmailAdminToUser(user, email)

	if err != nil {
		log.WithError(err).Warnf("[RESTfacility] sending password reset email failed for user %s", user.UserId.String())
		return errors.New("[RESTfacility] failed to send password reset email")
	}

	return nil
}
