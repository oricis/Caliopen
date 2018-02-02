/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package devices

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// GetDevicesList handles GET /devices
func GetDevicesList(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// NewDevice handles POST /devices
func NewDevice(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// GetDevice handles GET /devices/:deviceID
func GetDevice(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// PatchDevice handles PATCH /devices/:deviceID
func PatchDevice(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// DeleteDevice handles DELETE /devices/:deviceID
func DeleteDevice(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}
