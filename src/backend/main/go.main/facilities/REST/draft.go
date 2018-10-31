// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	"encoding/json"
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/messages"
	log "github.com/Sirupsen/logrus"
	"time"
)

func (rest *RESTfacility) SendDraft(user_id, msg_id string) (msg *Message, err error) {
	const nats_order = "deliver"
	natsMessage := fmt.Sprintf(Nats_message_tmpl, nats_order, msg_id, user_id)

	draft, draftErr := rest.store.RetrieveMessage(user_id, msg_id)
	if draftErr != nil {
		log.WithError(draftErr).Info("[SendDraft] failed to retrieve draft from store")
		return nil, errors.New("draft not found")
	}
	// resolve sender's address protocol for selecting natsTopics accordingly
	protocol, resolvErr := rest.ResolveSenderProtocol(draft)
	if resolvErr != nil {
		log.WithError(resolvErr).Info("[SendDraft] failed to resolve sender's protocol")
		return nil, errors.New("unknown protocol for sender")
	}

	var natsTopic string
	switch protocol {
	case ImapProtocol:
		natsTopic = Nats_outIMAP_topicKey
	case SmtpProtocol, EmailProtocol:
		natsTopic = Nats_outSMTP_topicKey
	case TwitterProtocol:
		natsTopic = Nats_outTwitter_topicKey
	default:
		return nil, fmt.Errorf("[SendDraft] no handler for <%s> protocol", protocol)
	}
	rep, err := rest.nats_conn.Request(rest.natsTopics[natsTopic], []byte(natsMessage), 30*time.Second)
	if err != nil {
		log.WithError(err).Warn("[RESTfacility]: SendDraft error")
		if rest.nats_conn.LastError() != nil {
			log.WithError(rest.nats_conn.LastError()).Warn("[RESTfacility]: SendDraft error")
			return nil, err
		}
		return nil, err
	}
	var reply DeliveryAck
	err = json.Unmarshal(rep.Data, &reply)
	if err != nil {
		log.WithError(err).Warn("[RESTfacility]: SendDraft error")
		return nil, err
	}
	if reply.Err {
		log.Warn("[RESTfacility]: SendDraft error")
		return nil, errors.New(reply.Response)
	}
	msg, err = rest.store.RetrieveMessage(user_id, msg_id)
	if err != nil {
		return nil, err
	}
	messages.SanitizeMessageBodies(msg)
	(*msg).Body_excerpt = messages.ExcerptMessage(*msg, 200, true, true)
	return msg, err
}

// ResolveSenderProtocol returns outbound protocol to use for sending draft by resolving draft's sender identity
func (rest *RESTfacility) ResolveSenderProtocol(draft *Message) (string, error) {
	firstIdentity, err := rest.RetrieveUserIdentity(draft.User_id.String(), draft.UserIdentities[0].String(), false) // handle one identity only for now
	if err != nil {
		return "", err
	}
	return firstIdentity.Protocol, nil
}
