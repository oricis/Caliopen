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
	"errors"
	"fmt"
	log "github.com/Sirupsen/logrus"
	"github.com/hashicorp/go-multierror"
)

func (b *emailBroker) startIncomingSmtpAgent() error {
	for i := 0; i < b.Config.InWorkers; i++ {
		go b.incomingSmtpWorker()
	}
	//TODO: error handling
	return nil
}

func (b *emailBroker) incomingSmtpWorker() {
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
		go b.processInbound(in)
	}
}

// for now, ProcessInbound only store raw email and sends an order on NATS topic for py.delivery to process it
// in future, this broker should process the whole delivery, including the email marshalling into a Caliopen's message format
func (b *emailBroker) processInbound(in *SmtpEmail) {
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

	rcptsIds, err := b.Store.GetRecipients(in.EmailMessage.Email.SmtpRcpTo)

	if err != nil {
		log.WithError(err).Warn("inbound: recipients lookup failed")
		resp.Err = errors.New("recipients store lookup failed")
		return
	}

	if len(rcptsIds) == 0 {
		resp.Err = errors.New("no recipient found in Caliopen keyspace")
		return
	}

	//step 2 : store raw email and get its raw_id
	raw_email_id, err := b.Store.StoreRaw(in.EmailMessage.Email.Raw.String())
	if err != nil {
		log.WithError(err).Warn("inbound: storing raw email failed")
		resp.Err = errors.New("storing raw email failed")
		return
	}

	//step 3 : send deliver order fo each recipient
	var errs error
	for _, rcptId := range rcptsIds {

		natsMessage := fmt.Sprintf("{\"user_id\": \"%s\", \"raw_email_id\": \"%s\"}", rcptId, raw_email_id)
		err := b.NatsConn.Publish(b.Config.InTopic, []byte(natsMessage))
		if err != nil {
			errs = multierror.Append(errs, err)
		}
	}

	// we assume the previous MTA did the rcpts lookup, so all rcpts should be OK
	// consequently, we discard the whole delivery if there is at least one error
	if errs != nil {
		resp.Err = errors.New(fmt.Sprint(errs.Error()))
		return
	}

}

// deliverMsgToUser marshal an incoming email to the Caliopen message format
// TODO
func (b *emailBroker) deliverMsgToUser() {}
