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
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"time"
)

type Sender struct {
	NatsConn     *nats.Conn
	NatsMessage  *nats.Msg
	OutSMTPtopic string
}

type smtpOrder struct {
	Order     string `json:"order"`
	MessageId string `json:"message_id"`
	UserId    string `json:"user_id"`
}

func (s *Sender) SendDraft(msg *nats.Msg) error {
	log.Info("SENDING DRAFT VIA REMOTE ACCOUNT")
	var order smtpOrder
	err := json.Unmarshal(msg.Data, &order)
	if err != nil {
		return fmt.Errorf("Unable to unmarshal message from NATS. Payload was <%s>", string(msg.Data))
	}

	//1. send order to LMTP
	const nats_order = "deliver"
	natsMessage := fmt.Sprintf(Nats_message_tmpl, nats_order, order.MessageId, order.UserId)
	smtpReply, err := s.NatsConn.Request(s.OutSMTPtopic, []byte(natsMessage), 30*time.Second)
	if err != nil {
		if smtpReply != nil {
			s.natsReplyError(smtpReply, err)
		} else {
			s.natsReplyError(msg, err)
		}
		return err
	}

	//2. handle LMTP response

	//3. if message sent, update IMAP status accordingly

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
