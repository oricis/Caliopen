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

package REST

import (
	log "github.com/Sirupsen/logrus"
)

// PublishOnNats publishes a simple message on a topic
func (rest *RESTfacility) PublishOnNats(message, topic string) error {
	err := rest.nats_conn.Publish(topic, []byte(message))
	if err != nil {
		log.WithError(err).Warn("[RESTfacility]: PublishOnNats failed")
		if rest.nats_conn.LastError() != nil {
			log.WithError(rest.nats_conn.LastError()).Warn("[RESTfacility]: PublishOnNats failed")
			return err
		}
		return err
	}
	return nil
}
