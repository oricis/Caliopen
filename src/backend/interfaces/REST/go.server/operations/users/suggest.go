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

// GET …/identities/?q=
func SuggestIdentities(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	query_string := ctx.Param("q")
	if len(query_string) < 3 {
		e := swgErr.New(http.StatusUnprocessableEntity, "Query string must be at least 3 chars long.")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	suggest, err := caliopen.Facilities.RESTfacility.SuggestIdentities(user_id, query_string)
	if err != nil {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ctx.JSON(http.StatusOK, suggest)
}
