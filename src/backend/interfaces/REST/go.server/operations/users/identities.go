// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package users

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

//GET …/identities/{identity_id}
func GetLocalIdentity(ctx *gin.Context) {
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
}

//GET …/identities/locals
func GetLocalsIdentities(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	identities, err := caliopen.Facilities.RESTfacility.LocalsIdentities(user_id)
	if err != nil {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ret := struct {
		Total            int                     `json:"total"`
		LocalsIdentities []objects.LocalIdentity `json:"local_identities"`
	}{len(identities), identities}
	ctx.JSON(http.StatusOK, ret)
}
