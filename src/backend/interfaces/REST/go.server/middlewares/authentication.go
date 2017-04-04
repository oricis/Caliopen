// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package http_middleware

import (
	"encoding/json"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/redis.v5"
	"strconv"
	"time"
)

type auth_cache struct {
	Access_token  string    `json:"access_token"`
	Expires_in    int       `json:"expires_in"`
	Expires_at    time.Time `json:"expires_at"`
	Refresh_token string    `json:"refresh_token"`
}

func BasicAuthFromCache(cache *redis.Client, realm string) gin.HandlerFunc {
	if realm == "" {
		realm = "Authorization Required"
	}
	realm = "Basic realm=" + strconv.Quote(realm)

	return func(c *gin.Context) {
		// Get provided auth headers
		var user_id, access_token string
		var ok bool
		if user_id, access_token, ok = c.Request.BasicAuth(); !ok {
			kickUnauthorizedRequest(c, realm)
		}
		// Search user in redis cache of allowed credentials
		var cache_str string
		var err error
		cache_str, err = cache.Get("tokens::" + user_id).Result()
		if err != nil {
			kickUnauthorizedRequest(c, realm)
		}
		var cache auth_cache
		err = json.Unmarshal([]byte(cache_str), &cache)
		if err != nil || cache.Access_token != access_token || time.Since(cache.Expires_at) > 0 {
			kickUnauthorizedRequest(c, realm)
		}

		//save user_id in context for future retreival
		c.Set("user_id", user_id)
	}
}

func kickUnauthorizedRequest(c *gin.Context, realm string) {
	// we return 401 and abort handlers chain.
	c.Header("WWW-Authenticate", realm)
	c.AbortWithStatus(401)
}

//bespoke unmarshaller to workaround the expires_at field that is not RFC in cache (tz is missing, thanks python)
func (ac *auth_cache) UnmarshalJSON(b []byte) error {
	var temp struct {
		Access_token  string `json:"access_token"`
		Expires_in    int    `json:"expires_in"`
		Expires_at    string `json:"expires_at"`
		Refresh_token string `json:"refresh_token"`
	}
	if err := json.Unmarshal(b, &temp); err != nil {
		return err
	}
	ac.Access_token = temp.Access_token
	ac.Expires_in = temp.Expires_in
	expire, err := time.Parse(time.RFC3339Nano, temp.Expires_at+"Z")
	if err != nil {
		return err
	}
	ac.Expires_at = expire
	ac.Refresh_token = temp.Refresh_token
	return nil
}
