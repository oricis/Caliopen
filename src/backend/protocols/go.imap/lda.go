/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	broker "github.com/CaliOpen/Caliopen/src/backend/brokers/go.emails"
)

//Local Delivery Agent, in charge of IO between fetcher and our email broker
type Lda struct {
	Config           WorkerConfig
	broker           *broker.EmailBroker
	brokerConnectors broker.EmailBrokerConnectors
}

func NewLda(config WorkerConfig) (lda *Lda, err error) {
	lda = new(Lda)
	(*lda).Config = config
	(*lda).broker, (*lda).brokerConnectors, err = broker.Initialize(config.LDAConfig)
	return
}

func (lda *Lda) shutdown() error {
	lda.broker.ShutDown()
	return nil
}
