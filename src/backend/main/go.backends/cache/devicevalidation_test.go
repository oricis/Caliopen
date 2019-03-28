// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	"bytes"
	"testing"
	"time"
)

func TestRedisBackend_SetDeviceValidationSession(t *testing.T) {
	mockCache, mockRedis, err := InitializeTestCache()
	if err != nil {
		t.Error(err)
		return
	}

	session, err := mockCache.SetDeviceValidationSession("user_id", "device_id", "token")
	if err != nil {
		t.Error(err)
	}
	// check that TokenSession is well-formed
	ttl := int((deviceValidationTTL * time.Hour) / time.Second)
	if session.ExpiresIn != ttl {
		t.Errorf("expected TokenSession.ExpiresIn = %d, got %d", ttl, session.ExpiresIn)
	}
	if session.Token != "token" {
		t.Errorf("expected TokenSession.Token = token, got %s", session.Token)
	}
	if session.UserId != "user_id" {
		t.Errorf("expected TokenSession.UserId = user_id, got %s", session.UserId)
	}
	if session.ResourceId != "device_id" {
		t.Errorf("expected TokenSession.ResourceId = device_id, got ResourceId = %s", session.ResourceId)
	}

	// check that two keys with correct TTL have been effectively put in cache
	deviceValue, err := mockCache.Backend.Get(validationPrefix + "user_id::device_id")
	if err != nil {
		t.Errorf("failed to retrieve deviceKey : %s", err)
	}
	tokenValue, err := mockCache.Backend.Get(validationPrefix + "user_id::token")
	if err != nil {
		t.Errorf("failed to retrieve tokenKey : %s", err)
	}

	if !bytes.Equal(deviceValue, tokenValue) {
		t.Errorf("expected deviceValue and tokenValue to be the same, got %s and %s", string(deviceValue), string(tokenValue))
	}
	deviceTTL, err := mockRedis.GetTTL(validationPrefix + "user_id::device_id")
	if err != nil {
		t.Errorf("failed to retrieve TTL for deviceKey : %s", err)
	}
	if int(deviceTTL/time.Second) != ttl {
		t.Errorf("expected deviceTTl set to %d, got %d", ttl, deviceTTL)
	}
	tokenTTL, err := mockRedis.GetTTL(validationPrefix + "user_id::token")
	if err != nil {
		t.Errorf("failed to retrieve TTL for tokenKey : %s", err)
	}
	if int(tokenTTL/time.Second) != ttl {
		t.Errorf("expected tokenTTl set to %d, got %d", ttl, tokenTTL)
	}
}

func TestRedisBackend_GetDeviceValidationSession(t *testing.T) {
	mockCache, _, err := InitializeTestCache()
	if err != nil {
		t.Error(err)
		return
	}
	sessionSet, err := mockCache.SetDeviceValidationSession("user_id", "device_id", "token")
	if err != nil {
		t.Error(err)
	}

	sessionGot, err := mockCache.GetDeviceValidationSession("user_id", "device_id")
	if err != nil {
		t.Error(err)
	}

	if sessionSet.Token != sessionGot.Token {
		t.Errorf("expected to retrieve a TokenSession with same Token = token, got %s", sessionGot.Token)
	}
}

func TestRedisBackend_GetTokenValidationSession(t *testing.T) {
	mockCache, _, err := InitializeTestCache()
	if err != nil {
		t.Error(err)
		return
	}
	sessionSet, err := mockCache.SetDeviceValidationSession("user_id", "device_id", "token")
	if err != nil {
		t.Error(err)
	}

	sessionGot, err := mockCache.GetTokenValidationSession("user_id", "device_id")
	if err != nil {
		t.Error(err)
	}

	if sessionSet.Token != sessionGot.Token {
		t.Errorf("expected to retrieve a TokenSession with same Token = token, got %s", sessionGot.Token)
	}
}

func TestRedisBackend_DeleteDeviceValidationSession(t *testing.T) {
	mockCache, mockRedis, err := InitializeTestCache()
	if err != nil {
		t.Error(err)
		return
	}
	_, err = mockCache.SetDeviceValidationSession("user_id", "device_id", "token")
	if err != nil {
		t.Error(err)
	}

	err = mockCache.DeleteDeviceValidationSession("user_id", "device_id")
	if err != nil {
		t.Error(err)
	}

	// check that both keys have been deleted
	var value []byte
	value, err = mockRedis.Get(validationPrefix + "user_id::device_id")
	if err == nil || value != nil {
		t.Errorf("delete deviceKey failed : expected to have not found error and nil value, got err = %s and value = %s", err, string(value))
	}
	value, err = mockRedis.Get(validationPrefix + "user_id::token")
	if err == nil || value != nil {
		t.Errorf("delete tokenKey failed : expected to have not found error and nil value, got err = %s and value = %s", err, string(value))
	}
}
