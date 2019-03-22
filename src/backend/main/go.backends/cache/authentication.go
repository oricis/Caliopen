// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	"encoding/json"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"strings"
)

// GetAuthToken retrieves auth values stored for the given key
// values are casted into an Auth_cache struct
// key is in the form of "tokens::user_id"
func (c *Cache) GetAuthToken(key string) (value *Auth_cache, err error) {
	value = &Auth_cache{}
	cache_str, err := c.Backend.Get(key)
	if err != nil {
		log.WithError(err).Errorf("[GetAuthToken] failed to get cache key %s", key)
		return nil, err
	}

	err = json.Unmarshal(cache_str, value)
	if err != nil {
		log.WithError(err).Errorf("[GetAuthToken] failed to unmarshal cache %s for key", cache_str, key)
		return nil, err
	}
	return
}

// LogoutUser will delete the entry of the user corresponding to the key
func (c *Cache) LogoutUser(key string) error {
	if !strings.HasPrefix(key, "tokens::") {
		return errors.New("Unvalid key")
	}
	err := c.Backend.Del(key)
	if err != nil {
		log.WithError(err).Errorf("[LogoutUser] failed to delete key %s", key)
	}
	return err
}
