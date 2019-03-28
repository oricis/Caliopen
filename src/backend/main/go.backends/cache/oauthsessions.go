// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"time"
)

const (
	oauthSessionPrefix = "oauthsession::"
	oauthSessionTTL    = 10 // ttl in minutes
)

// GetOauthSession unmarshal json found at `key`, if any, into an OauthSession struct
func (c *Cache) GetOauthSession(key string) (session *OauthSession, err error) {
	session_str, err := c.Backend.Get(oauthSessionPrefix + key)
	if err != nil {
		log.WithError(err).Errorf("[GetOauthSession] failed to get key %s", key)
		return nil, err
	}

	session = &OauthSession{}
	err = json.Unmarshal(session_str, session)
	if err != nil {
		log.WithError(err).Errorf("[GetOauthSession] failed to unmarshal session %s for key %s", session_str, key)
		return nil, err
	}
	return
}

// SetOauthSession put `OauthSession` as a json string at `key` prefixed with oauthSessionPrefix
func (c *Cache) SetOauthSession(key string, session *OauthSession) (err error) {
	ttl := oauthSessionTTL * time.Minute
	session_str, err := json.Marshal(session)
	if err != nil {
		log.WithError(err).Errorf("[SetOauthSession] failed to marshal session.for key %s", key)
		return err
	}

	err = c.Backend.Set(oauthSessionPrefix+key, session_str, ttl)
	if err != nil {
		log.WithError(err).Errorf("[SetOauthSession] failed to set session for key %s", key)
		return err
	}

	return nil
}

// DeleteOauthSession deletes value found at `key` prefixed with oauthSessionPrefix
func (c *Cache) DeleteOauthSession(key string) error {
	err := c.Backend.Del(oauthSessionPrefix + key)
	if err != nil {
		log.WithError(err).Errorf("[DeleteOauthSession] failed to delete session for key %s", key)
		return err
	}
	return nil
}
