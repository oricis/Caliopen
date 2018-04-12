/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package go_remoteIDs

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type PollerConfig struct {
	ScanInterval uint16            `mapstructure:"scan_interval"`
	RemoteTypes  []string          `mapstructure:"remote_types"`
	StoreName    string            `mapstructure:"store_name"`
	StoreConfig  StoreConfig       `mapstructure:"store_settings"`
	NatsUrl      string            `mapstructure:"nats_url"`
	NatsTopics   map[string]string `mapstructure:"nats_topics"`
}
