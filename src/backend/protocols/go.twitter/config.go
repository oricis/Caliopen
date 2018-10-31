// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC

package twitterworker

import (
	broker"github.com/CaliOpen/Caliopen/src/backend/brokers/go.twitter"
)

type WorkerConfig struct {
	TwitterAppKey string `mapstructure:"twitter_app_key"`
	TwitterAppSecret string `mapstructure:"twitter_app_secret"`
	BrokerConfig broker.BrokerConfig `mapstructure:"BrokerConfig"`
}

var AppConfig *WorkerConfig

func init() {
	AppConfig = &WorkerConfig{}
}
