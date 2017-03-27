// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package email_broker handles codec/decodec between emails and Caliopen message format
package email_broker

/* outbound logic :
- subscribe to 'deliver' topic on NATS channel 'outboundSMTP'
- for each incoming NATS message
	retrieves message from db
	builds email
	forwards email to SMTP outboundDaemon(s) (go.smtp package)
	stores the raw_email that's been sent
	updates message status in store and index
*/

import (
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"errors"
	"time"
)

func (b *EmailBroker) startOutcomingSmtpAgent() error {

	sub, err := b.NatsConn.QueueSubscribe(b.Config.OutTopic, b.Config.NatsQueue, func(msg *nats.Msg) {
		_, err := b.natsMsgHandler(msg)
		if err != nil {
			log.WithError(err).Warn("broker outbound : nats msg handler failed to process incoming msg")
		}

	})
	if err != nil {
		return err
	}
	b.natsSubscriptions = append(b.natsSubscriptions, sub)
	b.NatsConn.Flush()

	//TODO: error handling
	return nil
}

// retrieves a caliopen message from db, build an email from it
// sends the email to recipient(s) and stores the raw email sent in db
func (b *EmailBroker) natsMsgHandler(msg *nats.Msg) (resp []byte, err error) {
	var order natsOrder
	json.Unmarshal(msg.Data, &order)

	if order.Order == "deliver" {
		//retrieve message from db
		m, err := b.Store.GetMessage(order.UserId, order.MessageId)
		if err != nil {
			log.Warn(err)
			//TODO
		}

		em, err := MarshalEmail(m, b.Config.AppVersion, b.Config.PrimaryMailHost)
		if err != nil {
			log.Warn(err)
			//TODO
		}

		out := SmtpEmail{
			EmailMessage: em,
			Response:     make(chan *DeliveryAck),
		}

		b.Connectors.OutcomingSmtp <- &out
		// non-blocking wait for delivery ack
		go func(out *SmtpEmail, natsMsg *nats.Msg) {
			select {
			case resp, ok := <-out.Response:
				if resp.Err != nil || !ok || resp == nil {
					log.WithError(err).Warn("outbound: delivery error from MTA")
					//TODO
				} else {
					err = b.SaveIndexSentEmail(resp)
					if err != nil {
						log.Warn("outbound: error when saving back sent email")
						resp.Err = err
					}
				}
				resp.Response = "message " + resp.EmailMessage.Message.Message_id.String() + " has been sent."
				json_resp, _ := json.Marshal(resp)
				b.NatsConn.Publish(msg.Reply, json_resp)
			case <-time.After(time.Second * 30):
				log.Warn("email broker : outbound timeout waiting smtp response")

				var order natsOrder
				json.Unmarshal(msg.Data, &order)
				ack := DeliveryAck{
					Err:      errors.New("timeout waiting smtp response"),
					Response: "failed to sent message " + order.MessageId,
				}

				json_resp, _ := json.Marshal(ack)
				b.NatsConn.Publish(msg.Reply, json_resp)
			}
			return
		}(&out, msg)

	}

	return resp, err
}

// bespoke implementation of the json.Unmarshaler interface
// assuming well formatted NATS JSON message
// hydrates the natsOrder with provided data
func (msg *natsOrder) UnmarshalJSON(data []byte) error {
	msg.Order = string(data[10:17])
	msg.MessageId = string(data[34:70])
	msg.UserId = string(data[84:120])
	//TODO: error handling
	return nil
}
