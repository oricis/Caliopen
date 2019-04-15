// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package discussions

import (
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

// GET …/discussions
func GetDiscussionsList(ctx *gin.Context) {
	e := swgErr.New(http.StatusFailedDependency, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
}

// GET …/discussions/:discussion_id
func GetDiscussion(ctx *gin.Context) {
	e := swgErr.New(http.StatusFailedDependency, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
}
