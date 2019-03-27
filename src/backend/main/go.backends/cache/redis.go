// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/backendstest"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/redis.v5"
	"time"
)

type redisBackend struct {
	client *redis.Client
}

func InitializeRedisBackend(config CacheConfig) (c *Cache, err error) {
	c = new(Cache)
	c.CacheConfig = config

	redisClient := redis.NewClient(&redis.Options{
		Addr:     config.Host,
		Password: config.Password,
		DB:       config.Db,
	})
	_, err = redisClient.Ping().Result()
	if err != nil {
		log.WithError(err).Errorf("[RedisBackend] initialize failed")
		return nil, err
	}

	c.Backend = &redisBackend{
		client: redisClient,
	}

	return
}

func (rb *redisBackend) Set(key string, value []byte, ttl time.Duration) error {
	return rb.client.Set(key, value, ttl).Err()
}

func (rb *redisBackend) Get(key string) (value []byte, err error) {
	return rb.client.Get(key).Bytes()
}

func (rb *redisBackend) Del(key string) error {
	return rb.client.Del(key).Err()
}

func InitializeTestCache() (c *Cache, mock *backendstest.MockRedis, err error) {
	c = new(Cache)
	mock = &backendstest.MockRedis{
		Store: map[string][]byte{},
		Ttl:   map[string]time.Duration{},
	}
	c.Backend = mock
	return
}
