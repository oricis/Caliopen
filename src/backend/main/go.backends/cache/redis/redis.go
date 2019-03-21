// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/redis.v5"
	"time"
)

type (
	RedisBackend struct {
		CacheConfig
		backend *redis.Client
	}
)

func InitializeRedisBackend(config CacheConfig) (cache *RedisBackend, err error) {
	cache = new(RedisBackend)
	err = cache.initialize(config)
	return
}

func (rb *RedisBackend) initialize(config CacheConfig) (err error) {
	rb.CacheConfig = config
	client := redis.NewClient(&redis.Options{
		Addr:     config.Host,
		Password: config.Password,
		DB:       config.Db,
	})
	_, err = client.Ping().Result()
	if err != nil {
		log.WithError(err).Errorf("[RedisBackend] initialize failed")
		return err
	}
	rb.backend = client
	return nil
}

func (rb *RedisBackend) Set(key string, value []byte, ttl time.Duration) error {
	return rb.backend.Set(key, value, ttl).Err()
}

func (rb *RedisBackend) Get(key string) (value []byte, err error) {
	return rb.backend.Get(key).Bytes()
}

func (rb *RedisBackend) Del(key string) error {
	return rb.backend.Del(key).Err()
}
