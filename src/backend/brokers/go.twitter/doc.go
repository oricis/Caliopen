// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package twitter_broker is a bridge between Twitter message model and Caliopen message model
// inbound : it unmarshal direct messages from Twitter into Caliopen's Message struct, stores it and triggers relevant actions via NATS message queue
// outbound : it listens to NATS message orders to retrieve a Caliopen Message and converts it to direct message ready to be sent through Twitter API

package twitter_broker

