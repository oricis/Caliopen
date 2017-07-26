// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package messages

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	swgErr "github.com/go-openapi/errors"
	"github.com/satori/go.uuid"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
	"strconv"
)

// GET …/messages
func GetMessagesList(ctx *gin.Context) {
	user_uuid, _ := uuid.FromString(ctx.MustGet("user_id").(string))
	var user_UUID UUID
	user_UUID.UnmarshalBinary(user_uuid.Bytes())
	discussion_id := ctx.Request.URL.Query().Get("discussion_id")
	if discussion_id == "" {
		e := swgErr.New(http.StatusUnprocessableEntity, "Missing 'discussion_id' param in query")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	filter := MessagesListFilter{
		User_id: user_UUID,
		Terms: map[string]string{
			"discussion_id": discussion_id,
		},
	}
	list, err := caliopen.Facilities.RESTfacility.GetMessagesList(filter)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		var respBuf bytes.Buffer
		respBuf.WriteString("{\"total\": " + strconv.Itoa(len(list)) + ",")
		respBuf.WriteString("\"messages\":[")
		first := true
		for _, msg := range list {
			json_msg, err := msg.MarshalFrontEnd()
			if err == nil {
				if first {
					first = false
				} else {
					respBuf.WriteByte(',')
				}
				respBuf.Write(json_msg)
			}
		}
		respBuf.WriteString("]}")
		ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
	}
}

// GET …/messages/:message_id
func GetMessage(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	msg_id := ctx.Param("message_id")
	msg, err := caliopen.Facilities.RESTfacility.GetMessage(user_id, msg_id)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		msg_json, err := msg.MarshalFrontEnd()
		if err != nil {
			e := swgErr.New(http.StatusFailedDependency, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
		} else {
			ctx.Data(http.StatusOK, "application/json; charset=utf-8", msg_json)
		}
	}
}
