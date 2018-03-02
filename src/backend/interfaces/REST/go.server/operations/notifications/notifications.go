/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package notifications

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
	"strconv"
	"time"
)

// GetPendingNotif handles GET /notifications
// two optional params may be in query : `to` and `from` to narrow the notifications list to a time range.
func GetPendingNotif(ctx *gin.Context) {
	userId := ctx.MustGet("user_id").(string)

	from, to := time.Time{}, time.Time{}

	to_param := ctx.Query("to")
	if to_param != "" {
		t, err := time.Parse(time.RFC3339, to_param)
		if err != nil {
			e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
		to = t
	}

	from_param := ctx.Query("from")
	if from_param != "" {
		f, err := time.Parse(time.RFC3339, from_param)
		if err != nil {
			e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
		from = f
	}

	notifs, err := caliopen.Facilities.Notifiers.RetrieveNotifications(userId, from, to)
	if err != nil && err.Cause().Error() != "notifications not found" {
		returnedErr := new(swgErr.CompositeError)
		returnedErr = swgErr.CompositeValidationError(err, err.Cause())
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
	}
	var respBuf bytes.Buffer
	respBuf.WriteString("{\"total\": " + strconv.Itoa(len(notifs)) + ",")
	respBuf.WriteString(("\"notifications\":["))
	first := true
	for _, notif := range notifs {
		json_notif, err := notif.MarshalFrontEnd()
		if err == nil {
			if first {
				first = false
			} else {
				respBuf.WriteByte(',')
			}
			respBuf.Write(json_notif)
		}
	}
	respBuf.WriteString("]}")
	ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
}

// DeleteNotifications handles DELETE /notifications
func DeleteNotifications(ctx *gin.Context) {

	userId := ctx.MustGet("user_id").(string)

	until := time.Time{}

	until_param := ctx.Query("until")
	if until_param != "" {
		u, err := time.Parse(time.RFC3339, until_param)
		if err != nil {
			e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
		until = u
	}

	err := caliopen.Facilities.Notifiers.DeleteNotifications(userId, until)
	if err != nil {
		returnedErr := new(swgErr.CompositeError)
		if err.Code() == DbCaliopenErr && err.Cause().Error() == "not found" {
			ctx.Status(http.StatusNoContent)
			return
		} else {
			returnedErr = swgErr.CompositeValidationError(err, err.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
		return
	}
	ctx.Status(http.StatusNoContent)
}
