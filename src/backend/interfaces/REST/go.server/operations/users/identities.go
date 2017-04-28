// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package users

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

//GET …/identities/{identity_id}
func GetLocalIdentity(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

//GET …/identities/locals
func GetLocalsIdentities(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	identities, err := caliopen.Facilities.RESTfacility.LocalsIdentities(user_id)
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		//TODO: returns error conforming to swagger def.
	}
	ret := struct {
		Total            int                     `json:"total"`
		LocalsIdentities []objects.LocalIdentity `json:"local_identities"`
	}{len(identities), identities}
	ctx.JSON(http.StatusOK, ret)
}
