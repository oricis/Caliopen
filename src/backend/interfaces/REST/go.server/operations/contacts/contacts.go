/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package contacts

import (
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	swgErr "github.com/go-openapi/errors"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// GetContactList handles GET /contacts
func GetContactsList(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// NewContact handles POST /contacts
func NewContact(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// GetContact handles GET /contacts/:contactID
func GetContact(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)
	contactID, err := operations.NormalizeUUIDstring(ctx.Param("contactID"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contact, err := caliopen.Facilities.RESTfacility.RetrieveContact(userID, contactID)
	if err != nil {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contact_json, err := contact.MarshalFrontEnd()
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		ctx.Data(http.StatusOK, "application/json; charset=utf-8", contact_json)
	}
}

// PatchContact handles PATCH /contacts/:contactID
func PatchContact(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// DeleteContact handles DELETE /contacts/:contactID
func DeleteContact(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)
	contactID, err := operations.NormalizeUUIDstring(ctx.Param("contactID"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	err = caliopen.Facilities.RESTfacility.DeleteContact(userID, contactID)
	if err != nil {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ctx.Status(http.StatusNoContent)
}
