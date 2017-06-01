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
		BackendName  string   `mapstructure:"backend_name"`
		Hosts        []string `mapstructure:"hosts"`
		Keyspace     string   `mapstructure:"keyspace"`
		Consistency  uint16   `mapstructure:"consistency_level"`
		SizeLimit    uint64   `mapstructure:"raw_size_limit"` // max size for db (in bytes)
		ObjStoreType string   `mapstructure:"object_store"`
		OSSConfig             `mapstructure:"obj_store_settings"`
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
	// Objects Store
	OSSConfig struct {
		Endpoint  string            `mapstructure:"endpoint"`
		AccessKey string            `mapstructure:"access_key"`
		SecretKey string            `mapstructure:"sercret_key"`
		Location  string            `mapstructure:"location"`
		Buckets   map[string]string `mapstructure:"buckets"`
	}
)
