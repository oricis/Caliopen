// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package go_remoteIDs

import (
	"encoding/json"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
)

type MqHandler struct {
	natsConn *nats.Conn
	natsSub  *nats.Subscription
}

func initMqHandler() (*MqHandler, error) {
	handler := new(MqHandler)
	natsConn, err := nats.Connect(poller.Config.NatsUrl)
	if err != nil {
		log.WithError(err).Warn("[initMqHandler] : initialization of NATS connexion failed")
		return handler, errors.New("[initMqHandler] failed to init NATS connection")
	}
	handler.natsConn = natsConn
	sub, err := handler.natsConn.QueueSubscribe(poller.Config.NatsTopics["id_cache"], poller.Config.NatsQueue, handler.natsIngressHandler)
	if err != nil {
		log.WithError(err).Warn("[initMqHandler] : initialization of NATS subscription failed")
		handler.natsConn = nil
		return handler, errors.New("[initMqHandler] failed to init NATS subscription")
	}
	handler.natsSub = sub
	return handler, nil
}

// natsIngressHandler handles nats messages received by poller from external components
func (mqh *MqHandler) natsIngressHandler(msg *nats.Msg) {

	var order RemoteIDNatsMessage
	err := json.Unmarshal(msg.Data, &order)
	if err != nil {
		log.WithError(err).Warn("unable to unmarshal nats order")
	}
	switch order.Order {
	case "update_interval":
		/*
			idKey := order.UserId + order.IdentityId
			cacheEntry := p.Cache[idKey]
			cacheEntry.pollInterval = order.PollInterval
			p.Cache[idKey] = cacheEntry
			p.UpdateJobFor(idKey)
		*/
	case "delete":
		//TODO
	case "add":
		//TODO
	default:
		log.Warnf("no handler for order '%s' on topic '%s'", order.Order, msg.Subject)
	}
}

func (mqh *MqHandler) EmitOrder(order []byte, topic string) error {
	err := mqh.natsConn.Publish(topic, order)
	if err != nil {
		log.WithError(err).Warnf("[EmitOrder] failed to publish this nats message : %s", order)
		return errors.New("[EmitOrder] failed to publish nats message")
	}
	return nil
}

// RequestFor publishes message on relevant nats queue to spawn a new protocol worker
// and handles response
func (mqh *MqHandler) RequestFor(idkey string) error {
	return nil
}

/*
// CancelFor publishes message on relevant nats queue directed at relevant worker
func (mqh *MqHandler) CancelFor(idkey string) error {
	var entry cacheEntry
	var ok bool
	if entry, ok = p.Cache[idkey]; !ok {
		return errors.New("cache entry not found")
	}
	switch entry.remoteProtocol {
	case "twitter":
		natsMsg := BrokerOrder{
			Order:    "remove_worker",
			UserId:   entry.userID.String(),
			RemoteId: entry.remoteID.String(),
		}
		j, e := json.Marshal(natsMsg)
		if e != nil {
			log.WithError(e).Warn("[addWorkerFor] failed to marshal nats message")
			return e
		}
		return p.NatsConn.Publish(p.Config.NatsTopics["twitter_worker"], j)

	}
	return nil
}

// UpdateWorkerFor publishes message on nats queue directed at relevant worker
func (mqh *MqHandler) UpdateWorkerFor(idkey string) error {
	var entry cacheEntry
	var ok bool
	if entry, ok = p.Cache[idkey]; !ok {
		return errors.New("cache entry not found")
	}
	switch entry.remoteProtocol {
	case "twitter":
		natsMsg := BrokerOrder{
			Order:    "reload_worker",
			UserId:   entry.userID.String(),
			RemoteId: entry.remoteID.String(),
		}
		j, e := json.Marshal(natsMsg)
		if e != nil {
			log.WithError(e).Warn("[addWorkerFor] failed to marshal nats message")
			return e
		}
		return p.NatsConn.Publish(p.Config.NatsTopics["twitter_worker"], j)

	}
	return nil
}

*/
func (mqh *MqHandler) Stop() {
	mqh.natsSub.Unsubscribe()
	mqh.natsConn.Close()
}
