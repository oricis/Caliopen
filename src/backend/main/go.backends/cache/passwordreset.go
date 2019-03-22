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
	sessionPrefix    = "resetsession::"
	resetTokenPrefix = "resettoken::"
	resetPasswordTTL = 8 // ttl in hours
)

// GetResetPasswordSession returns reset password session values stored for the userId, if any
// Returns a nil 'session' if key is not found
func (c *Cache) GetResetPasswordSession(userId string) (session *TokenSession, err error) {
	key := sessionPrefix + userId
	session_str, err := c.Backend.Get(key)
	if err != nil {
		log.WithError(err).Errorf("[GetResetPasswordSession] failed to get key %s", key)
		return nil, err
	}

	session = &TokenSession{}
	err = json.Unmarshal(session_str, session)
	if err != nil {
		log.WithError(err).Errorf("[GetResetPasswordSession] failed to unmarshal value %s for key %s", session_str, key)
		return nil, err
	}
	return
}

// SetResetPasswordSession stores key,value for given userId and resetToken.
// The key will be in the form of "resetsession::userId".
// Func will also call setResetPasswordToken() to add a secondary key in the form "resettoken::resetToken" pointing to the same value
// Func returns a pointer to the Pass_reset_session object that represents values stored in the cache.
// userId and resetToken strings must be well-formatted, they will not be checked.
func (c *Cache) SetResetPasswordSession(userId, resetToken string) (session *TokenSession, err error) {
	ttl := resetPasswordTTL * time.Hour
	expiration := time.Now().Add(ttl)
	session = &TokenSession{
		ExpiresAt: expiration,
		ExpiresIn: int(ttl / time.Second),
		Token:     resetToken,
		UserId:    userId,
	}
	session_str, err := json.Marshal(session)
	if err != nil {
		log.WithError(err).Errorf("[SetResetPasswordSession] failed to marshal session %s", session)
		return nil, err
	}

	err = c.Backend.Set(sessionPrefix+userId, session_str, ttl)
	if err != nil {
		log.WithError(err).Errorf("[SetResetPasswordSession] failed to set session key in cache for user %s", userId)
		return nil, err
	}

	err = c.setResetPasswordToken(resetToken, session_str, ttl)
	if err != nil {
		log.WithError(err).Errorf("[SetResetPasswordSession] failed to setResetPasswordToken in cache for user %s", userId)
		return nil, err
	}
	return session, nil
}

// SetResetPasswordToken stores key,value for given resetToken.
// It is called by SetResetPasswordSession to add a secondary key pointing to the same underlying value.
// The key is in the form "resettoken::resetToken"
func (c *Cache) setResetPasswordToken(token string, session []byte, ttl time.Duration) error {
	return c.Backend.Set(resetTokenPrefix+token, session, ttl)
}

// GetResetPasswordToken returns values found for the given resetToken key
func (c *Cache) GetResetPasswordToken(token string) (session *TokenSession, err error) {
	key := resetTokenPrefix + token
	session_str, err := c.Backend.Get(key)
	if err != nil {
		log.WithError(err).Errorf("[GetResetPasswordToken] failed to get key for token %s", token)
		return nil, err
	}

	session = &TokenSession{}
	err = json.Unmarshal(session_str, session)
	if err != nil {
		log.WithError(err).Errorf("[GetResetPasswordToken] failed to unmarshal session %s for token %s", session_str, token)
		return nil, err
	}
	return
}

// DeleteResetPasswordSession will delete two keys in a row :
// the resetsession key and the resettoken key
func (c *Cache) DeleteResetPasswordSession(userId string) error {

	session, err := c.GetResetPasswordSession(userId)
	if err != nil {
		log.WithError(err).Errorf("[DeleteResetPasswordSession] failed to get session for user %s", userId)
		return err
	}

	key := sessionPrefix + userId
	err = c.Backend.Del(key)
	if err != nil {
		log.WithError(err).Errorf("[DeleteResetPasswordSession] failed to delete session for user %s", userId)
		return err
	}

	key = resetTokenPrefix + session.Token
	err = c.Backend.Del(key)
	if err != nil {
		log.WithError(err).Errorf("[DeleteResetPasswordSession] failed to delete session token for user %s", userId)
		return err
	}
	return nil
}
