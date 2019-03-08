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
	SendEmailAdminToUser(user *User, participants []Participant, email *Message) error
}

const (
	resetPasswordTemplate   = "email-reset-password-link.yaml"
	onboardingEmailTemplate = "email-onboarding.yaml"
	welcomeEmailTemplate    = "email-welcome.yaml"
	resetLinkFmt            = "%s/auth/passwords/reset/%s"
)

// ByEmail notifies an user by the mean of an email.
func (N *Notifier) ByEmail(notif *Notification) CaliopenError {
	if N.admin == nil {
		err := NewCaliopenErr(FailDependencyCaliopenErr, "[NotificationsFacility] can't SendEmailAdminToUser, no admin user has been set")
		log.Error(err)
		return err
	}
	N.LogNotification("ByEmail", notif)
	switch notif.Type {
	case NotifAdminMail:
		participants := []Participant{
			{ // sender
				Address:  N.adminLocalID.Identifier,
				Label:    N.adminLocalID.DisplayName,
				Protocol: EmailProtocol,
				Type:     ParticipantFrom,
			},
			{ // recipient
				Address:     notif.User.RecoveryEmail,
				Contact_ids: []UUID{notif.User.ContactId},
				Label:       notif.User.Name,
				Protocol:    EmailProtocol,
				Type:        ParticipantTo,
			},
		}
		if notif.Body == "ccLocalMailbox" {
			locals, err := N.Store.RetrieveLocalsIdentities(notif.User.UserId.String())
			if err != nil {
				log.WithError(err).Warnf("[SendEmailAdminToUser] failed to retrieve local identities for user %s", notif.User.UserId)
			} else {
				for _, localIdentity := range locals {
					if localIdentity.Identifier != "" {
						participants = append(participants, Participant{
							Address:  localIdentity.Identifier,
							Label:    localIdentity.DisplayName,
							Protocol: EmailProtocol,
							Type:     ParticipantCC,
						})
					}
				}
			}
		}
		N.SendEmailAdminToUser(notif.User, participants, notif.InternalPayload.(*Message))
	case NotifPasswordReset:
		N.SendPasswordResetEmail(notif.User, notif.InternalPayload.(*Pass_reset_session))
	case OnboardingMails:
		N.SendOnboardingMails(notif.User)
	default:
		return NewCaliopenErrf(UnprocessableCaliopenErr, "[Notifier]ByEmail : unknown notification type <%s>", notif.Type)
	}
	return nil
}

// SendEmailAdminToUser sends an administrative email to recipients found in participants slice.
// Participants must include at least one `From` and one `To`
// this is an email composed by the backend to inform user that something happened related to its account
// func is in charge of saving & indexing draft before sending the "deliver" order to the SMTP broker.
func (notif *Notifier) SendEmailAdminToUser(user *User, participants []Participant, email *Message) error {
	if email == nil {
		return errors.New("[SendEmailAdminToUser] can't send a nil email")
	}
	now := time.Now()
	(*email).Date = now
	(*email).Date_insert = now
	(*email).Message_id.UnmarshalBinary(uuid.NewV4().Bytes())
	(*email).Discussion_id.UnmarshalBinary(uuid.NewV4().Bytes())
	(*email).Is_draft = true
	(*email).Participants = participants
	(*email).Protocol = EmailProtocol
	(*email).User_id = notif.admin.UserId
	(*email).UserIdentities = []UUID{notif.adminLocalID.Id}

	// save & index message
	err := notif.Store.CreateMessage(email)
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
	rep, err := notif.NatsQueue.Request(notif.natsTopics[Nats_outSMTP_topicKey], natsMessage, 30*time.Second)
	if err != nil {
		log.WithError(err).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
		if notif.NatsQueue.LastError() != nil {
			log.WithError(notif.NatsQueue.LastError()).Warn("[EmailNotifiers]: SendEmailAdminToUser error")
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
	email, err := RenderEmail(notif.config.TemplatesPath+resetPasswordTemplate, context)
	if err != nil {
		log.WithError(err).Warnf("[RESTfacility] failed to build reset email from template for user %s", user.UserId.String())
		return errors.New("[RESTfacility] failed to build reset email")
	}
	participants := []Participant{
		{ // sender
			Address:  (*notif.adminLocalID).Identifier,
			Label:    (*notif.adminLocalID).DisplayName,
			Protocol: EmailProtocol,
			Type:     ParticipantFrom,
		},
		{ // recipient
			Address:     user.RecoveryEmail,
			Contact_ids: []UUID{user.ContactId},
			Label:       user.Name,
			Protocol:    EmailProtocol,
			Type:        ParticipantTo,
		},
	}

	err = notif.SendEmailAdminToUser(user, participants, email)

	if err != nil {
		log.WithError(err).Warnf("[RESTfacility] sending password reset email failed for user %s", user.UserId.String())
		return errors.New("[RESTfacility] failed to send password reset email")
	}

	return nil
}

// SendOnboardingMails builds and sends one-time emails to user that signed-up
func (notif *Notifier) SendOnboardingMails(user *User) error {
	if user == nil {
		return errors.New("[SendOnboardingMails] must be called with an user, got nil")
	}

	recipients := []Participant{}
	// retrieve user's local email
	locals, err := notif.Store.RetrieveLocalsIdentities(user.UserId.String())
	if err != nil {
		log.WithError(err).Warnf("[SendEmailAdminToUser] failed to retrieve local identities for user %s", user.UserId)
		return errors.New("failed to retrieve user's local email address, can't send email")
	}
	for _, localIdentity := range locals {
		if localIdentity.Identifier != "" {
			recipients = append(recipients, Participant{
				Address:  localIdentity.Identifier,
				Label:    localIdentity.DisplayName,
				Protocol: EmailProtocol,
				Type:     ParticipantTo,
			})
		}
	}

	// build and send first email
	onboardingMail, err := RenderEmail(notif.config.TemplatesPath+onboardingEmailTemplate, map[string]interface{}{})
	if err == nil {
		participants := recipients
		participants = append(participants, Participant{ // sender
			Address:  "contact@alpha.caliopen.org", // TODO: use config
			Label:    "Caliopen",
			Protocol: EmailProtocol,
			Type:     ParticipantFrom,
		})
		err = notif.SendEmailAdminToUser(user, participants, onboardingMail)
		if err != nil {
			log.WithError(err).Warnf("[SendOnboardingMails] failed to send onboarding mail for user %s", user.UserId)
		}
	} else {
		log.WithError(err).Warnf("[SendOnboardingMails] failed to render onboardingMail. This email won't be send.")
	}

	// build and send first email
	welcomeMail, err := RenderEmail(notif.config.TemplatesPath+welcomeEmailTemplate, map[string]interface{}{})
	if err == nil {
		participants := recipients
		participants = append(participants, Participant{ // sender
			Address:  "noreply@alpha.caliopen.org", // TODO: use config
			Label:    "Laurent Chemla",
			Protocol: EmailProtocol,
			Type:     ParticipantFrom,
		})
		err = notif.SendEmailAdminToUser(user, participants, welcomeMail)
		if err != nil {
			log.WithError(err).Warnf("[SendOnboardingMails] failed to send welcome mail for user %s", user.UserId)
		}
	} else {
		log.WithError(err).Warnf("[SendOnboardingMails] failed to render welcomeMail. This email won't be send.")
	}

	return nil
}
