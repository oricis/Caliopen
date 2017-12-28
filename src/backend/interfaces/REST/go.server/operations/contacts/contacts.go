/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package contacts

import (
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
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// PatchContact handles PATCH /contacts/:contactID
func PatchContact(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}

// DeleteContact handles DELETE /contacts/:contactID
func DeleteContact(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
}
