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
		ObjectStore      string      `mapstructure:"object_store"`
		OSSConfig        OSSConfig   `mapstructure:"object_store_settings"`
		InTopic          string      `mapstructure:"in_topic"`
		InWorkers        int         `mapstructure:"lda_workers_size"`
		LogReceivedMails bool        `mapstructure:"log_received_mails"`
		OutTopic         string      `mapstructure:"out_topic"`
		NatsListeners    int         `mapstructure:"nats_listeners"`
		PrimaryMailHost  string      `mapstructure:"primary_mail_host"`
		AppVersion       string      `mapstructure:"version"`
	}

	StoreConfig struct {
		Hosts       []string `mapstructure:"hosts"`
		Keyspace    string   `mapstructure:"keyspace"`
		Consistency uint16   `mapstructure:"consistency_level"`
		SizeLimit   uint64   `mapstructure:"raw_size_limit"` // max size to store (in bytes)
	}

	IndexConfig struct {
		Urls []string `mapstructure:"urls"`
	}

	OSSConfig struct {
		Endpoint  string            `mapstructure:"endpoint"`
		AccessKey string            `mapstructure:"access_key"`
		SecretKey string            `mapstructure:"secret_key"`
		Location  string            `mapstructure:"location"`
		Buckets   map[string]string `mapstructure:"buckets"`
	}
)
