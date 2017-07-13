// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package email_broker handles codec/decodec between emails and Caliopen message format
package email_broker

/* inbound is a Local Delivery Agent :
stores raw incoming emails once in storage
then orders email processing via NATS topic « inboundSMTPEmail »
*/

import (
	"encoding/json"
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/hashicorp/go-multierror"
	"sync"
	"time"
)

const nats_message_tmpl = "{\"order\":\"%s\",\"user_id\": \"%s\", \"message_id\": \"%s\"}"

func (b *EmailBroker) startIncomingSmtpAgent() error {
	for i := 0; i < b.Config.InWorkers; i++ {
		go b.incomingSmtpWorker()
	}
	//TODO: error handling
	return nil
}

func (b *EmailBroker) incomingSmtpWorker() {
	//  receives values from the channel repeatedly until channel is closed
	for in := range b.Connectors.IncomingSmtp {
		if in.EmailMessage == nil {
			log.Warn("broker error : incomingSmtpWorker received an empty payload")
			ack := &DeliveryAck{
				EmailMessage: in.EmailMessage,
				Err:          true,
				Response:     "empty payload",
			}
			select {
			case in.Response <- ack:
			//write was OK
			default:
				//unable to write, don't block
			}
		}
		go b.processInbound(in, true)
	}
}

// stores raw email + json + message and sends an order on NATS topic for next composant to process it
// if raw_only is true, only stores the raw email with its json representation but do not unmarshal to our message model
func (b *EmailBroker) processInbound(in *SmtpEmail, raw_only bool) {
	resp := &DeliveryAck{
		EmailMessage: in.EmailMessage,
		Err:          false,
		Response:     "",
	}
	defer func(r *DeliveryAck) {
		in.Response <- r
	}(resp)

	//step 1 : recipients lookup
	//         we need at least one valid recipient before processing further

	if len(in.EmailMessage.Email.SmtpRcpTo) == 0 {
		resp.Response = "no recipient"
		resp.Err = true
		return
	}

	if b.Config.LogReceivedMails {
		log.Infof("inbound: processing envelope From: %s -> To: %v", in.EmailMessage.Email.SmtpMailFrom, in.EmailMessage.Email.SmtpRcpTo)
	}

	rcptsIds, err := b.Store.GetUsersForRecipients(in.EmailMessage.Email.SmtpRcpTo)

	if err != nil {
		log.WithError(err).Warn("inbound: recipients lookup failed")
		resp.Response = "recipients store lookup failed"
		resp.Err = true
		return
	}

	if len(rcptsIds) == 0 {
		resp.Response = "no recipient found in Caliopen domain"
		resp.Err = true
		return
	}

	//step 2 : store raw email and get its raw_id
	raw_uuid, err := gocql.RandomUUID()
	var msg_id UUID
	msg_id.UnmarshalBinary(raw_uuid.Bytes())
	m := RawMessage{
		Raw_msg_id: msg_id,
		Raw_Size:   uint64(len(in.EmailMessage.Email.Raw.String())),
		Raw_data:   in.EmailMessage.Email.Raw.String(),
	}
	err = b.Store.StoreRawMessage(m)
	if err != nil {
		log.WithError(err).Warn("inbound: storing raw email failed")
		resp.Response = "storing raw email failed"
		resp.Err = true
		return
	}

	//step 3 : send process order to nats for each rcpt
	var errs error
	wg := new(sync.WaitGroup)
	wg.Add(len(rcptsIds))
	for _, rcptId := range rcptsIds {
		go func(rcptId UUID) {
			defer wg.Done()
			const nats_order = "process_raw"
			natsMessage := fmt.Sprintf(nats_message_tmpl, nats_order, rcptId.String(), m.Raw_msg_id.String())
			// XXX manage timeout correctly
			resp, err := b.NatsConn.Request(b.Config.InTopic, []byte(natsMessage), 10*time.Second)
			if err != nil {
				if b.NatsConn.LastError() != nil {
					log.WithError(b.NatsConn.LastError()).Warnf("EmailBroker failed to publish inbound request on NATS for user %s", rcptId.String())
					errs = multierror.Append(errs, err)
				} else {
					log.WithError(err).Warnf("EmailBroker failed to publish inbound request on NATS for user %s", rcptId.String())
					errs = multierror.Append(errs, err)
				}
			} else {
				nats_ack := new(map[string]interface{})
				err := json.Unmarshal(resp.Data, &nats_ack)
				if err != nil {
					log.WithError(err).Warnf("EmailBroker failed to parse inbound ack on NATS for user %s", rcptId.String())
					errs = multierror.Append(err)
					return
				}
				if err, ok := (*nats_ack)["error"]; ok {
					log.WithField("error", err.(string)).Warnf("EmailBroker failed to publish inbound request on NATS for user %s", rcptId.String())
					errs = multierror.Append(errors.New(err.(string)))
					return
				}

				//nats delivery OK
				if b.Config.LogReceivedMails {
					log.Infof("EmailBroker : NATS inbound request successfully handled for user %s : %s", rcptId.String(), (*nats_ack)["message"])
				}
			}
		}(rcptId)
	}
	wg.Wait()
	// we assume the previous MTA did the rcpts lookup, so all rcpts should be OK
	// consequently, we discard the whole delivery if there is at least one error
	if errs != nil {
		resp.Response = fmt.Sprint(errs.Error())
		resp.Err = true
		return
	}

}

// deliverMsgToUser marshal an incoming email to the Caliopen message format
// TODO
func (b *EmailBroker) deliverMsgToUser() {}
