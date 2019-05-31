/*
 * // Copyleft (ɔ) 2019 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imports

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

// ImportFile handles POST /imports and do logic depending on file mime type
func ImportFile(ctx *gin.Context) {
	userId, err := operations.NormalizeUUIDstring(ctx.MustGet("user_id").(string))

	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	shard_id := ctx.MustGet("shard_id").(string)
	user_info := &UserInfo{User_id: userId, Shard_id: shard_id}

	file, _, err := ctx.Request.FormFile("file")
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// TODO manage import switch file content-type / name
	err = caliopen.Facilities.RESTfacility.ImportVcardFile(user_info, file)
	if err != nil {
		var e error
		e = swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		ctx.Status(http.StatusOK)
	}
	return
}
