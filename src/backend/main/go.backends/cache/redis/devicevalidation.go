// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	"encoding/json"
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/redis.v5"
	"time"
)

const (
	validationPrefix    = "validationsession::"
	deviceValidationTTL = 24 // ttl in hours
)

func (cache *RedisBackend) GetDeviceValidationSession(userId, deviceId string) (session *TokenSession, err error) {
	return cache.getValidationSession(validationPrefix + userId + "::" + deviceId)
}

func (cache *RedisBackend) GetTokenValidationSession(userId, token string) (session *TokenSession, err error) {
	return cache.getValidationSession(validationPrefix + userId + "::" + token)
}

func (cache *RedisBackend) getValidationSession(key string) (session *TokenSession, err error) {
	session_str, err := cache.client.Get(key).Bytes()
	if err != nil {
		log.WithError(err).Errorf("[getValidationSession] failed to get key %s", key)
		return nil, err
	}
	session = &TokenSession{}
	err = json.Unmarshal(session_str, session)
	if err != nil {
		log.WithError(err).Errorf("[getValidationSession] failed to unmarshal value %s for key %s", session_str, key)
		return nil, err
	}
	return
}

// SetDeviceValidationSession sets two keys in cache facility
// - one to retrieve session by device id
// - one to retrieve session by token
func (cache *RedisBackend) SetDeviceValidationSession(userId, deviceId, token string) (session *TokenSession, err error) {
	ttl := deviceValidationTTL * time.Hour
	expiration := time.Now().Add(ttl)
	session = &TokenSession{
		ExpiresAt:  expiration,
		ExpiresIn:  int(ttl / time.Second),
		Token:      token,
		UserId:     userId,
		ResourceId: deviceId,
	}
	session_str, err := json.Marshal(session)
	if err != nil {
		log.WithError(err).Errorf("[SetDeviceValidationSession] failed to marshal session %s", session)
		return nil, err
	}
	prefix := validationPrefix + userId + "::"
	deviceKey := prefix + deviceId
	tokenKey := prefix + token

	_, err = cache.client.Set(deviceKey, session_str, ttl).Result()
	if err != nil {
		log.WithError(err).Errorf("[SetDeviceValidationSession] failed to set session key in cache for user %s, deviceId %s", userId, deviceId)
		return nil, err
	}

	_, err = cache.client.Set(tokenKey, session_str, ttl).Result()
	if err != nil {
		log.WithError(err).Errorf("[SetDeviceValidationSession] failed to set session key in cache for user %s, token %s", userId, token)
		cache.client.Del(deviceKey)
		return nil, err
	}

	return session, nil
}

// DeleteDeviceValidationSession deletes the two keys associated with a device validation session
func (cache *RedisBackend) DeleteDeviceValidationSession(userId, deviceId string) error {

	session, _ := cache.GetDeviceValidationSession(userId, deviceId)
	if session == nil {
		log.Errorf("[DeleteDeviceValidationSession] failed to retrieve session for user %s, device %s", userId, deviceId)
		return errors.New("not found")
	}

	prefix := validationPrefix + userId + "::"
	deviceKey := prefix + deviceId
	tokenKey := prefix + session.Token

	_, err := cache.client.Del(deviceKey).Result()
	if err != nil && err != redis.Nil {
		log.WithError(err).Errorf("[DeleteDeviceValidationSession] failed to delete device validation session for user %s, device %s", userId, deviceId)
	}
	_, err = cache.client.Del(tokenKey).Result()
	if err != nil && err != redis.Nil {
		log.WithError(err).Errorf("[DeleteDeviceValidationSession] failed to delete device validation session for user %s, token %s", userId, session.Token)
	}
	return nil
}
