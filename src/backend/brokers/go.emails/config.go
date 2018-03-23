// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package email_broker

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type (
	LDAConfig struct {
		AppVersion       string         `mapstructure:"version"`
		BrokerType       string         `mapstructure:"broker_type"`
		ContactsTopic    string         `mapstructure:"contacts_topic"`
		InTopic          string         `mapstructure:"in_topic"`
		InWorkers        int            `mapstructure:"lda_workers_size"`
		IndexConfig      IndexConfig    `mapstructure:"index_settings"`
		IndexName        string         `mapstructure:"index_name"`
		LogReceivedMails bool           `mapstructure:"log_received_mails"`
		NatsListeners    int            `mapstructure:"nats_listeners"`
		NatsQueue        string         `mapstructure:"nats_queue"`
		NatsURL          string         `mapstructure:"nats_url"`
		NotifierConfig   NotifierConfig `mapstructure:"NotifierConfig"`
		OutTopic         string         `mapstructure:"out_topic"`
		PrimaryMailHost  string         `mapstructure:"primary_mail_host"`
		StoreConfig      StoreConfig    `mapstructure:"store_settings"`
		StoreName        string         `mapstructure:"store_name"`
	}

	StoreConfig struct {
		Hosts       []string  `mapstructure:"hosts"`
		Keyspace    string    `mapstructure:"keyspace"`
		Consistency uint16    `mapstructure:"consistency_level"`
		SizeLimit   uint64    `mapstructure:"raw_size_limit"` // max size to store (in bytes)
		ObjectStore string    `mapstructure:"object_store"`
		OSSConfig   OSSConfig `mapstructure:"object_store_settings"`
	}

	IndexConfig struct {
		Urls []string `mapstructure:"urls"`
	}
)
