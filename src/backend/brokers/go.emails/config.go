// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package email_broker

type (
	LDAConfig struct {
		BrokerType       string      `mapstructure:"broker_type"`
		NatsURL          string      `mapstructure:"nats_url"`
		NatsQueue        string      `mapstructure:"nats_queue"`
		StoreName        string      `mapstructure:"store_name"`
		StoreConfig      StoreConfig `mapstructure:"store_settings"`
		IndexName        string      `mapstructure:"index_name"`
		IndexConfig      IndexConfig `mapstructure:"index_settings"`
		InTopic          string      `mapstructure:"in_topic"`
		InWorkers        int         `mapstructure:"lda_workers_size"`
		LogReceivedMails bool        `mapstructure:"log_received_mails"`
		OutTopic         string      `mapstructure:"out_topic"`
		NatsListeners    int         `mapstructure:"nats_listeners"`
		AppVersion       string
	}

	StoreConfig struct {
		Hosts       []string `mapstructure:"hosts"`
		Keyspace    string   `mapstructure:"keyspace"`
		Consistency uint16   `mapstructure:"consistency_level"`
	}
	IndexConfig struct {
		Urls []string `mapstructure:"urls"`
	}
)
