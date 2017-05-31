package messages

import (
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	swgErr "github.com/go-openapi/errors"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
	"strconv"
)

// POST …/:message_id/attachments
func UploadAttachment(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	msg_id := ctx.Param("message_id")
	file, header, err := ctx.Request.FormFile("attachment")
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	filename := header.Filename
	attchmtUrl, err := caliopen.Facilities.RESTfacility.AddAttachment(user_id, msg_id, filename, file)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	resp := struct {
		location string
	}{attchmtUrl}
	ctx.JSON(http.StatusOK, resp)
}

// DELETE …/:message_id/attachments/:attachment_index
func DeleteAttachment(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	msg_id := ctx.Param("message_id")
	attch_id, err := strconv.Atoi(ctx.Param("attachment_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	err = caliopen.Facilities.RESTfacility.DeleteAttachment(user_id, msg_id, attch_id)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ctx.AbortWithStatus(http.StatusOK)
}
