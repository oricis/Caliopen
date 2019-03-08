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
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/users"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"time"
)

func (b *EmailBroker) startOutcomingSmtpAgents() error {

	sub, err := b.NatsConn.QueueSubscribe(b.Config.OutTopic, b.Config.NatsQueue, func(msg *nats.Msg) {
		_, err := b.natsMsgHandler(msg)
		if err != nil {
			log.WithError(err).Warn("[broker outbound] : nats msg handler failed to process incoming msg")
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

		em, err := b.MarshalEmail(m)
		if err != nil {
			log.Warn(err)
			b.natsReplyError(msg, err)
			return resp, err
		}

		//checks that we have at least one sender and one recipient
		if len(em.Email.SmtpRcpTo) == 0 || len(em.Email.SmtpMailFrom) == 0 {
			b.natsReplyError(msg, errors.New("missing sender and/or recipient"))
			return resp, err
		}

		out := SmtpEmail{
			EmailMessage: em,
			MTAparams:    nil,
			Response:     make(chan *EmailDeliveryAck),
		}
		//checks if identity is local or remote
		//fetch credentials and remote server info accordingly
		if m.UserIdentities == nil || len(m.UserIdentities) == 0 {
			b.natsReplyError(msg, errors.New("message "+m.Message_id.String()+" (user "+m.User_id.String()+") has no user identity embedded"))
			return resp, err
		}
		firstIdentity, err := b.Store.RetrieveUserIdentity(m.User_id.String(), m.UserIdentities[0].String(), true) // handle one identity only for now
		if err != nil {
			b.natsReplyError(msg, fmt.Errorf("broker failed to retrieve sender's identity with error : %s", err))
			return resp, err
		}
		switch firstIdentity.Type {
		case RemoteIdentity:
			if firstIdentity.Credentials != nil {
				authType, foundAuthType := firstIdentity.Infos["authtype"]
				if foundAuthType {
					switch authType {
					case Oauth1:
						err = errors.New("oauth1 mechanism not implemented")
						b.natsReplyError(msg, err)
						return resp, err
					case Oauth2:
						out.MTAparams = &MTAparams{
							AuthType: Oauth2,
							Host:     firstIdentity.Infos["outserver"],
							Password: (*firstIdentity.Credentials)[users.CRED_ACCESS_TOKEN],
							User:     (*firstIdentity.Credentials)[users.CRED_USERNAME],
						}
					case LoginPassword:
						out.MTAparams = &MTAparams{
							AuthType: LoginPassword,
							Host:     firstIdentity.Infos["outserver"],
							Password: (*firstIdentity.Credentials)["outpassword"],
							User:     (*firstIdentity.Credentials)["outusername"],
						}
					default:
						err = fmt.Errorf("unknown auth mechanism : <%s>", authType)
						b.natsReplyError(msg, err)
						return resp, err
					}
				} else {
					// fallback by trying default LoginPassword mechanism
					out.MTAparams = &MTAparams{
						AuthType: LoginPassword,
						Host:     firstIdentity.Infos["outserver"],
						Password: (*firstIdentity.Credentials)["outpassword"],
						User:     (*firstIdentity.Credentials)["outusername"],
					}
				}

			} else {
				err = fmt.Errorf("remote identity %s has no credentials", firstIdentity.Id.String())
				b.natsReplyError(msg, err)
				return resp, err
			}
		case LocalIdentity:
		//nothing to do, MTAparams is already nil
		default:
			b.natsReplyError(msg, fmt.Errorf("broker can't handle sender's protocol %s", firstIdentity.Protocol))
			return resp, err
		}

		b.Connectors.Egress <- &out
		// non-blocking wait for delivery ack
		go func(out *SmtpEmail, natsMsg *nats.Msg) {
			select {
			case resp, ok := <-out.Response:
				if resp.Err || !ok || resp == nil {
					log.WithError(err).Warn("outbound: delivery error from MTA")
					b.natsReplyError(msg, errors.New("outbound: delivery error from MTA : "+resp.Response))
					return
				} else {
					err = b.SaveIndexSentEmail(resp)
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

func (b *EmailBroker) natsReplyError(msg *nats.Msg, err error) {
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
