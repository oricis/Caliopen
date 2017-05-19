// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package users

import (
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	swgErr "github.com/go-openapi/errors"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// POST …/users/
func Create(ctx *gin.Context) {
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
	return
}

func Get(ctx *gin.Context) {
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
	return
}
