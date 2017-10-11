// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package users

import (
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	swgErr "github.com/go-openapi/errors"
	"gopkg.in/gin-gonic/gin.v1"
	"io/ioutil"
	"net/http"
)

// PATCH …/users/{user_id}
// as of october 2017, PatchUser is partially implemented :
// it should be only use to change user's password.
func PatchUser(ctx *gin.Context) {
	var err error
	auth_user := ctx.MustGet("user_id").(string)
	user_id := ctx.Param("user_id")
	// for now, an user can only modify himself
	if (auth_user != user_id) || (user_id == "") {
		e := swgErr.New(http.StatusUnauthorized, "user can only modify himself")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	body, err := ioutil.ReadAll(ctx.Request.Body)
	patch, err := helpers.ParsePatch(body)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	err = caliopen.Facilities.RESTfacility.PatchUser(auth_user, patch, caliopen.Facilities.Notifiers)

	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		ctx.Status(http.StatusNoContent)
	}

}

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
