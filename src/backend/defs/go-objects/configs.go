package objects

type (
	CaliopenConfig struct {
		RESTstoreConfig RESTstoreConfig
		RESTindexConfig RESTIndexConfig
		NatsConfig      NatsConfig
		//LDAstoreConfig  LDAstoreConfig
	}

	// REST API
	RESTstoreConfig struct {
		BackendName string   `mapstructure:"backend_name"`
		Hosts       []string `mapstructure:"hosts"`
		Keyspace    string   `mapstructure:"keyspace"`
		Consistency uint16   `mapstructure:"consistency_level"`
		SizeLimit   uint64   `mapstructure:"raw_size_limit"` // max size to store (in bytes)
		S3Config    `mapstructure:"s3_settings"`
	}

	RESTIndexConfig struct {
		IndexName string   `mapstructure:"index_name"`
		Hosts     []string `mapstructure:"hosts"`
	}

	// NATS
	NatsConfig struct {
		Url           string `mapstructure:"url"`
		OutSMTP_topic string `mapstructure:"outSMTP_topic"`
	}
	// LDA
	S3Config struct {
		Endpoint  string            `mapstructure:"endpoint"`
		AccessKey string            `mapstructure:"access_key"`
		SecretKey string            `mapstructure:"sercret_key"`
		Location  string            `mapstructure:"location"`
		Buckets   map[string]string `mapstructure:"buckets"`
	}
	/*
			LDAConfig struct {
				BackendConfig    LDAstoreConfig `mapstructure:"backend_settings"`
				NumberOfWorkers  int            `mapstructure:"lda_workers_size"`
				LogReceivedMails bool           `mapstructure:"log_received_mails"`
				NatsURL          string         `mapstructure:"nats_url"`
				NatsTopic        string         `mapstructure:"nats_topic"`
			}

			LDAstoreConfig struct {
		                BackendName      string         `mapstructure:"backend_name"`
				Hosts       []string `mapstructure:"hosts"`
				Keyspace    string   `mapstructure:"keyspace"`
				Consistency uint16   `mapstructure:"consistency_level"`
			}
	*/
)
