/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"encoding/json"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"errors"
	"time"
)

type Sender struct {
	NatsConn     *nats.Conn
	NatsMessage  *nats.Msg
	OutSMTPtopic string
	Store backends.LDAStore
}

type smtpOrder struct {
	Order     string `json:"order"`
	MessageId string `json:"message_id"`
	UserId    string `json:"user_id"`
}

func (s *Sender) SendDraft(msg *nats.Msg) error {
	var order smtpOrder
	err := json.Unmarshal(msg.Data, &order)
	if err != nil {
		return fmt.Errorf("Unable to unmarshal message from NATS. Payload was <%s>", string(msg.Data))
	}

	//1. make use of our lmtpd to send email
	const nats_order = "deliver"
	natsMessage := fmt.Sprintf(Nats_message_tmpl, nats_order, order.MessageId, order.UserId)
	smtpReply, err := s.NatsConn.Request(s.OutSMTPtopic, []byte(natsMessage), 30*time.Second)

	//2. handle LMTP response
	if err != nil {
		if smtpReply != nil {
			s.natsReplyError(msg, errors.New(smtpReply.Reply))
		} else {
			s.natsReplyError(msg, err)
		}
		return err
	}
	var reply DeliveryAck
	err = json.Unmarshal(smtpReply.Data, &reply)
	if err != nil {
		e := fmt.Errorf("[IMAPworker]SendDraft failed to unmarshal smtpReply : %s", err)
		s.natsReplyError(msg, e)
		return e
	}
	if reply.Err {
		e := fmt.Errorf("[IMAPworker]SendDraft smtpReply has error : %s", reply.Response)
		s.natsReplyError(msg, errors.New(reply.Response))
		return e
	}

	//3. no error when sending email, then upload a copy to remote IMAP account
	sentMsg, err := s.Store.RetrieveMessage(order.UserId, order.MessageId)
	if err != nil {
		e := fmt.Errorf("[IMAPworker]SendDraft failed to retrieve sent message : %s", err)
		s.natsReplyError(msg, e)
		return e
	}
	err = s.UploadSentMessageToRemote(sentMsg)
	if err != nil {
		e := fmt.Errorf("[IMAPworker]SendDraft failed to upload sent email to remote IMAP account : %s", err)
		s.natsReplyError(msg, e)
		return e
	}

	//4. respond to caller
	s.NatsConn.Publish(msg.Reply, smtpReply.Data)
	return nil
}

func (s *Sender) natsReplyError(msg *nats.Msg, err error) {
	log.WithError(err).Warnf("IMAPworker [outbound] : error when processing incoming nats message : %s", *msg)

	ack := DeliveryAck{
		Err:      true,
		Response: fmt.Sprintf("failed to handle order with error « %s » ", err.Error()),
	}

	json_resp, _ := json.Marshal(ack)
	s.NatsConn.Publish(msg.Reply, json_resp)
}

func (s *Sender) UploadSentMessageToRemote(msg *Message) error {
	//get user
	user, err := s.Store.RetrieveUserIdentity(msg.User_id.String(), msg.UserIdentities[0].String(), true)
	if err != nil {
		return err
	}

	//get raw message
	rawMail, err := s.Store.GetRawMessage(msg.Raw_msg_id.String())
	if err != nil {
		return err
	}

	_, imapClient, _, err := imapLogin(user)
	if err != nil {
		return err
	}
	defer imapClient.Logout()

	return uploadSentMessage(imapClient, rawMail.Raw_data, msg.Date)
}