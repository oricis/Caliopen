/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package rest_api

import (
	log "github.com/Sirupsen/logrus"
	"github.com/gin-gonic/gin"
)

func Dumper() gin.HandlerFunc {
	return func(c *gin.Context) {
		// before request

		log.Infof("Client IP : %s", c.ClientIP())
		log.Infof("User Agent: %s", c.GetHeader("User-Agent"))

		c.Next()
		// after request

	}
}
