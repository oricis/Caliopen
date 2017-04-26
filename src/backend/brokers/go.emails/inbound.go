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
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
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
				Err:          errors.New("empty payload"),
				Response:     "",
			}
			select {
			case in.Response <- ack:
			//write was OK
			default:
				//unable to write, don't block
			}
		}
		go b.processInbound(in, false)
	}
}

// stores raw email + json + message and sends an order on NATS topic for next composant to process it
// if raw_only is true, only stores the raw email with its json representation but doen't unmarshal to our message model
func (b *EmailBroker) processInbound(in *SmtpEmail, raw_only bool) {
	resp := &DeliveryAck{
		EmailMessage: in.EmailMessage,
		Err:          nil,
		Response:     "",
	}
	defer func(r *DeliveryAck) {
		in.Response <- r
	}(resp)

	//step 1 : recipients lookup
	//         we need at least one valid recipient before processing further

	if len(in.EmailMessage.Email.SmtpRcpTo) == 0 {
		resp.Err = errors.New("no recipient")
		return
	}

	if b.Config.LogReceivedMails {
		log.Infof("inbound: processing envelope From: %s -> To: %v", in.EmailMessage.Email.SmtpMailFrom, in.EmailMessage.Email.SmtpRcpTo)
	}

	rcptsIds, err := b.Store.GetUsersForRecipients(in.EmailMessage.Email.SmtpRcpTo)

	if err != nil {
		log.WithError(err).Warn("inbound: recipients lookup failed")
		resp.Err = errors.New("recipients store lookup failed")
		return
	}

	if len(rcptsIds) == 0 {
		resp.Err = errors.New("no recipient found in Caliopen domain")
		return
	}

	//step 2 : store raw email and get its raw_id
	raw_email_id, err := b.Store.StoreRaw(in.EmailMessage.Email.Raw.String())
	if err != nil {
		log.WithError(err).Warn("inbound: storing raw email failed")
		resp.Err = errors.New("storing raw email failed")
		return
	}

	//step 3 : send process order to nats for each rcpt
	var errs error
	wg := new(sync.WaitGroup)
	wg.Add(len(rcptsIds))
	for _, rcptId := range rcptsIds {
		go func(rcptId objects.UUID) {
			defer wg.Done()
			const nats_order = "process_raw"
			natsMessage := fmt.Sprintf(nats_message_tmpl, nats_order, rcptId.String(), raw_email_id)
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
		resp.Err = errors.New(fmt.Sprint(errs.Error()))
		return
	}

}

// deliverMsgToUser marshal an incoming email to the Caliopen message format
// TODO
func (b *EmailBroker) deliverMsgToUser() {}
