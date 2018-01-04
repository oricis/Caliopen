// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package messages

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"mime"
	"net/http"
	"strconv"
	"time"
)

// POST …/:message_id/attachments
func UploadAttachment(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	shard_id := ctx.MustGet("shard_id").(string)
	user := &UserInfo{User_id: user_id, Shard_id: shard_id}
	msg_id, err := operations.NormalizeUUIDstring(ctx.Param("message_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	file, header, err := ctx.Request.FormFile("attachment")
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	filename := header.Filename
	content_type := header.Header["Content-Type"][0]
	attchmtUrl, err := caliopen.Facilities.RESTfacility.AddAttachment(user, msg_id, filename, content_type, file)
	if err != nil {
		var e error
		if err.Error() == "not found" {
			e = swgErr.New(http.StatusNotFound, err.Error())
		} else {
			e = swgErr.New(http.StatusFailedDependency, err.Error())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	resp := struct {
		TempId string `json:"temp_id"`
	}{tempId}
	ctx.JSON(http.StatusOK, resp)
}

// DELETE …/:message_id/attachments/:attachment_id
func DeleteAttachment(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	shard_id := ctx.MustGet("shard_id").(string)
	user := &UserInfo{User_id: user_id, Shard_id: shard_id}
	msg_id, err := operations.NormalizeUUIDstring(ctx.Param("message_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	attch_id, err := operations.NormalizeUUIDstring(ctx.Param("attachment_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	caliopenErr := caliopen.Facilities.RESTfacility.DeleteAttachment(user, msg_id, attch_id)
	if caliopenErr != nil {
		returnedErr := new(swgErr.CompositeError)
		if caliopenErr.Error() == "message not found" ||
			caliopenErr.Error() == "attachment not found" ||
			caliopenErr.Code() == NotFoundCaliopenErr {
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "db returned not found"), caliopenErr, caliopenErr.Cause())
		} else {
			returnedErr = swgErr.CompositeValidationError(caliopenErr, caliopenErr.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
	}
	ctx.Status(http.StatusOK)
}

// GET …/:message_id/attachments/:attachment_id
// sends attachment as a file to client
func DownloadAttachment(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	msg_id, err := operations.NormalizeUUIDstring(ctx.Param("message_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	meta, content, err := caliopen.Facilities.RESTfacility.OpenAttachment(user_id, msg_id, ctx.Param("attachment_id"))
	if err != nil {
		var e error
		if err.Error() == "attachment not found" {
			e = swgErr.New(http.StatusNotFound, err.Error())
		} else {
			e = swgErr.New(http.StatusFailedDependency, err.Error())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	// create a ReaderSeeker from the io.Reader returned by OpenAttachment
	size, err := strconv.ParseInt(meta["Message-Size"], 10, 64)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	attch_bytes := make([]byte, size)
	content.Read(attch_bytes)
	rs := bytes.NewReader(attch_bytes)

	ctx.Header("Content-Type", meta["Content-Type"])
	ctx.Header("Content-Disposition", `attachment; filename="`+mime.BEncoding.Encode("UTF-8", meta["Filename"])+`"`)
	http.ServeContent(ctx.Writer, ctx.Request, "", time.Time{}, rs)
}
