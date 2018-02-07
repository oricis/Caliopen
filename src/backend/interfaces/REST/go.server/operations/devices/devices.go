/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package devices

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
	"strconv"
)

// NewDevice handles POST /devices
func NewDevice(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// GetDevicesList handles GET /devices
func GetDevicesList(ctx *gin.Context) {
	userId := ctx.MustGet("user_id").(string)
	devices, err := caliopen.Facilities.RESTfacility.RetrieveDevices(userId)
	if err != nil {
		returnedErr := new(swgErr.CompositeError)
		if err.Code() == DbCaliopenErr && err.Cause().Error() == "devices not found" {
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "db returned not found"), err, err.Cause())
		} else {
			returnedErr = swgErr.CompositeValidationError(err, err.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
	} else {
		var respBuf bytes.Buffer
		respBuf.WriteString("{\"total\": " + strconv.Itoa(len(devices)) + ",")
		respBuf.WriteString(("\"tags\":["))
		first := true
		for _, device := range devices {
			json_device, err := device.MarshalFrontEnd()
			if err == nil {
				if first {
					first = false
				} else {
					respBuf.WriteByte(',')
				}
				respBuf.Write(json_device)
			}
		}
		respBuf.WriteString("]}")
		ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
	}
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
