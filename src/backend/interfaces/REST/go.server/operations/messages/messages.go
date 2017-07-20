// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package messages

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	swgErr "github.com/go-openapi/errors"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// GET …/messages
func GetMessagesList(ctx *gin.Context) {

	_ = MessagesListFilter{}
	ctx.Status(http.StatusNotImplemented)
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
