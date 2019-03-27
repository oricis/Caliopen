// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"gopkg.in/redis.v5"
	"time"
)

type MockRedis struct {
	Store map[string][]byte
	Ttl   map[string]time.Duration
}

func (mr *MockRedis) GetAuthToken(token string) (value *Auth_cache, err error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) LogoutUser(key string) error {
	return errors.New("test interface not implemented")
}
func (mr *MockRedis) GetResetPasswordToken(token string) (*TokenSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) GetResetPasswordSession(user_id string) (*TokenSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) SetResetPasswordSession(user_id, reset_token string) (*TokenSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) DeleteResetPasswordSession(user_id string) error {
	return errors.New("test interface not implemented")
}
func (mr *MockRedis) SetOauthSession(key string, session *OauthSession) error {
	return errors.New("test interface not implemented")
}
func (mr *MockRedis) GetOauthSession(key string) (*OauthSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) DeleteOauthSession(user_id string) error {
	return errors.New("test interface not implemented")
}
func (mr *MockRedis) GetDeviceValidationSession(userId, deviceId string) (*TokenSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) GetTokenValidationSession(userId, token string) (*TokenSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) SetDeviceValidationSession(userId, deviceId, token string) (*TokenSession, error) {
	return nil, errors.New("test interface not implemented")
}
func (mr *MockRedis) DeleteDeviceValidationSession(userId, deviceId string) error {
	return errors.New("test interface not implemented")
}

// Set mocks Set func from gopkg.in/redis.v5/internal
// expiration is not handled
func (mr *MockRedis) Set(key string, value []byte, expiration time.Duration) error {
	mr.Store[key] = value
	mr.Ttl[key] = expiration
	return nil
}

// Get mocks Get func from gopkg.in/redis.v5/internal
func (mr *MockRedis) Get(key string) (value []byte, err error) {
	if v, ok := mr.Store[key]; ok {
		return v, err
	} else {
		return nil, redis.Nil
	}
}

// Del mocks Del func from gopkg.in/redis.v5/internal
func (mr *MockRedis) Del(key string) error {
	delete(mr.Store, key)
	return nil
}

// GetTTL returns the Ttl that has been set along with a key when Set has been previously called
// for testing purpose
func (mr *MockRedis) GetTTL(key string) (Ttl time.Duration, err error) {
	if v, ok := mr.Ttl[key]; ok {
		return v, err
	} else {
		return 0, errors.New("not found")
	}
}
