// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package users

import (
	"gopkg.in/gin-gonic/gin.v1"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

// GET …/identities/suggest?context=xxxx&q=xxx
func SuggestIdentities(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	query_context := ctx.Request.URL.Query().Get("context")
	if query_context == "" {
		e := swgErr.New(http.StatusUnprocessableEntity, "Missing 'context' param in query")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	query_string := ctx.Request.URL.Query().Get("q")
	if query_string == "" {
		e := swgErr.New(http.StatusUnprocessableEntity, "Missing 'q' param in query")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	if len(query_string) < 3 {
		e := swgErr.New(http.StatusUnprocessableEntity, "Query string must be at least 3 chars long.")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	switch query_context {
	case "msg_compose":
		suggest, err := caliopen.Facilities.RESTfacility.SuggestRecipients(user_id, query_string)
		if err != nil {
			e := swgErr.New(http.StatusInternalServerError, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
		ctx.JSON(http.StatusOK, suggest)
	default:
		e := swgErr.New(http.StatusUnprocessableEntity, "Unknown ")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

}
