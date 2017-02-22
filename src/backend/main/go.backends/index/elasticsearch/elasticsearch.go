// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
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