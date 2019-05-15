// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	elastic "gopkg.in/olivere/elastic.v5"
)

type (
	ElasticSearchBackend struct {
		ElasticSearchConfig
		Client *elastic.Client
	}
	ElasticSearchConfig struct {
		Urls []string `mapstructure:"elastic_urls"`
	}

	Bucket struct {
		DocCount        int             `json:"doc_count"`
		Key             interface{}     `json:"key"`
		SubBucket       json.RawMessage `json:"sub_bucket"`
		UnreadCount     DocCounter      `json:"unread_count"`
		ImportanceLevel json.RawMessage `json:"importance_level"`
	}

	Aggregation struct {
		Buckets                 []Bucket `json:"buckets"`
		DocCountErrorUpperBound int      `json:"doc_count_error_upper_bound"`
		SumOtherDocCount        int      `json:"sum_other_doc_count"`
	}

	DocCounter struct {
		DocCount int `json:"doc_count"`
	}
)

func InitializeElasticSearchIndex(config ElasticSearchConfig) (es *ElasticSearchBackend, err error) {
	es = new(ElasticSearchBackend)
	err = es.initialize(config)
	return
}

func (es *ElasticSearchBackend) initialize(config ElasticSearchConfig) (err error) {
	// Create elastic client
	es.Client, err = elastic.NewClient(
		elastic.SetURL(config.Urls...),
		//elastic.SetTraceLog(log.StandardLogger()), // comment out to stop tracing requests & responses
	)

	if err != nil {
		log.WithError(err).Warn("package index : failed to create ES client")
		return
	}

	return
}

func (es *ElasticSearchBackend) Close() {
	es.Client.Stop()
}
