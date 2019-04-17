// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package participants

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
	"strings"
)

// GET …/participants/suggest?context=xxxx&q=xxx
func Suggest(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	shard_id := ctx.MustGet("shard_id").(string)
	user_info := &UserInfo{User_id: user_id, Shard_id: shard_id}
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
		// convert string query to lower to benefit the case insensitive search from ES
		// as suggest is in the context of a msg_compose, ie : we are looking for an address
		query_string = strings.ToLower(query_string)
		suggests, err := caliopen.Facilities.RESTfacility.SuggestRecipients(user_info, query_string)

		if err != nil {
			e := swgErr.New(http.StatusInternalServerError, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}

		ctx.JSON(http.StatusOK, suggests)
	default:
		e := swgErr.New(http.StatusUnprocessableEntity, "Unknown ")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

}
