// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"time"
)

const (
	oauthSessionPrefix = "oauthsession::"
	oauthSessionTTL    = 10 // ttl in minutes
)

// GetResetPasswordSession returns reset password session values stored for the user_id, if any
// Returns a nil 'session' if key is not found
func (cache *RedisBackend) GetOauthSession(userId string) (session *OauthSession, err error) {
	key := oauthSessionPrefix + userId
	session_str, err := cache.client.Get(key).Bytes()
	if err != nil {
		return nil, err
	}
	session = &OauthSession{}
	err = json.Unmarshal(session_str, session)
	if err != nil {
		return nil, err
	}
	return
}

// SetResetPasswordSession stores key,value for given user_id and reset_token.
// The key will be in the form of "resetsession::user_id".
// Func will also call setResetPasswordToken() to add a secondary key in the form "resettoken::reset_token" pointing to the same value
// Func returns a pointer to the Pass_reset_session object that represents values stored in the cache.
// user_id and reset_token strings must be well-formatted, they will not be checked.
func (cache *RedisBackend) SetOauthSession(userId string, session *OauthSession) (err error) {
	ttl := oauthSessionTTL * time.Minute
	session_str, err := json.Marshal(session)
	if err != nil {
		return err
	}

	_, err = cache.client.Set(oauthSessionPrefix+userId, session_str, ttl).Result()
	if err != nil {
		return err
	}

	return nil
}

// DeleteResetPasswordSession will delete two keys in a row :
// the resetsession key and the resettoken key
func (cache *RedisBackend) DeleteOauthSession(userId string) error {
	_, err := cache.client.Del(oauthSessionPrefix + userId).Result()
	if err != nil {
		return err
	}
	return nil
}
