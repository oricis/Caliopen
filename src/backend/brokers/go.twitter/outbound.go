/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package twitter_broker

import (
	"encoding/json"
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"time"
)

// retrieves a caliopen message from db, build a DM from it
// sends it through twitter API and stores the raw direct message sent in db
func (b *TwitterBroker) natsMsgHandler(msg *nats.Msg) (resp []byte, err error) {

	resp = []byte{}
	var order natsOrder
	err = json.Unmarshal(msg.Data, &order)
	if err != nil {
		return
	}

	if order.Order == "deliver" {
		//retrieve message from db
		m, err := b.Store.RetrieveMessage(order.UserId, order.MessageId)
		if err != nil {
			log.Warn(err)
			b.natsReplyError(msg, err)
			return resp, err
		}
		if m == nil {
			b.natsReplyError(msg, errors.New("message from db is empty"))
			return resp, err
		}
		//checks if message is draft
		if !m.Is_draft {
			b.natsReplyError(msg, errors.New("message is not a draft"))
			return resp, err
		}

		dm, err := b.MarshalDM(m)
		if err != nil {
			log.Warn(err)
			b.natsReplyError(msg, err)
			return resp, err
		}

		//checks that we have at least one sender and one recipient
		if dm.Message.SenderID == "" || dm.Message.Target.RecipientID == "" {
			b.natsReplyError(msg, errors.New("missing sender and/or recipient"))
			return resp, err
		}

		out := DMpayload{
			DM: dm,
			Response:     make(chan *DeliveryAck),
		}

		b.Connectors.Egress <- &out
		// non-blocking wait for delivery ack
		go func(out *DMpayload, natsMsg *nats.Msg) {
			select {
			case resp, ok := <-out.Response:
				if resp.Err || !ok || resp == nil {
					log.WithError(err).Warn("outbound: delivery error from MTA")
					b.natsReplyError(msg, errors.New("outbound: delivery error from MTA : "+resp.Response))
					return
				} else {
					err = b.SaveIndexSentDM(resp)
					if err != nil {
						log.Warn("outbound: error when saving back sent email")
						resp.Response = err.Error()
						resp.Err = true
					} else {
						resp.Err = false
						resp.Response = "message " + resp.EmailMessage.Message.Message_id.String() + " has been sent."
					}
				}
				json_resp, _ := json.Marshal(resp)
				b.NatsConn.Publish(msg.Reply, json_resp)
			case <-time.After(time.Second * 30):
				b.natsReplyError(msg, errors.New("SMTP server response timeout"))
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
	//TODO: better error handling
	if len(data) == 122 {
		msg.Order = string(data[10:17])
		msg.MessageId = string(data[34:70])
		msg.UserId = string(data[84:120])
	} else {
		log.Warnf("[Broker outbound] invalid natsOrder length for nats message : %s", data)
		return fmt.Errorf("[Broker outbound] invalid natsOrder length. Should be 122 bytes it is : %d", len(data))
	}
	return nil
}

func (b *TwitterBroker) natsReplyError(msg *nats.Msg, err error) {
	log.WithError(err).Warnf("email broker [outbound] : error when processing incoming nats message : %s", *msg)

	var order natsOrder
	json.Unmarshal(msg.Data, &order)
	ack := DeliveryAck{
		Err:      true,
		Response: fmt.Sprintf("failed to send message %s with error « %s » ", order.MessageId, err.Error()),
	}

	json_resp, _ := json.Marshal(ack)
	b.NatsConn.Publish(msg.Reply, json_resp)
}
