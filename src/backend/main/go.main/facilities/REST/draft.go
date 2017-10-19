// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/CaliOpen/Caliopen/src/backend/brokers/go.emails"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/messages"
	log "github.com/Sirupsen/logrus"
	"time"
)

func (rest *RESTfacility) SendDraft(user_id, msg_id string) (msg *Message, err error) {
	const nats_order = "deliver"
	natsMessage := fmt.Sprintf(Nats_message_tmpl, nats_order, msg_id, user_id)
	rep, err := rest.nats_conn.Request(rest.nats_outSMTP_topic, []byte(natsMessage), 30*time.Second)
	if err != nil {
		log.WithError(err).Warn("[RESTfacility]: SendDraft error")
		if rest.nats_conn.LastError() != nil {
			log.WithError(rest.nats_conn.LastError()).Warn("[RESTfacility]: SendDraft error")
			return nil, err
		}
		return nil, err
	}
	var reply email_broker.DeliveryAck
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
