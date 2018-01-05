/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package contacts

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"github.com/satori/go.uuid"
	"net/http"
	"strconv"
)

// GetContactList handles GET /contacts
func GetContactsList(ctx *gin.Context) {
	var limit, offset int
	var user_UUID UUID

	user_uuid_str := ctx.MustGet("user_id").(string)
	user_uuid, _ := uuid.FromString(user_uuid_str)
	user_UUID.UnmarshalBinary(user_uuid.Bytes())

	query_values := ctx.Request.URL.Query()
	if l, ok := query_values["limit"]; ok {
		limit, _ = strconv.Atoi(l[0])
		query_values.Del("limit")
	}
	if o, ok := query_values["offset"]; ok {
		offset, _ = strconv.Atoi(o[0])
		query_values.Del("offset")
	}

	filter := IndexSearch{
		User_id: user_UUID,
		Terms:   map[string][]string(query_values),
		Limit:   limit,
		Offset:  offset,
	}

	list, totalFound, err := caliopen.Facilities.RESTfacility.RetrieveContacts(filter)
	if err != nil {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	var respBuf bytes.Buffer
	respBuf.WriteString("{\"total\": " + strconv.FormatInt(totalFound, 10) + ",")
	respBuf.WriteString("\"contacts\":[")
	first := true
	for _, contact := range list {
		json_contact, err := contact.MarshalFrontEnd()
		if err == nil {
			if first {
				first = false
			} else {
				respBuf.WriteByte(',')
			}
			respBuf.Write(json_contact)
		}
	}
	respBuf.WriteString("]}")
	ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
}

// NewContact handles POST /contacts
func NewContact(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	userID, err := operations.NormalizeUUIDstring(user_id)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contact := new(Contact)
	err = ctx.ShouldBindJSON(contact)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contact.UserId.UnmarshalBinary(uuid.FromStringOrNil(userID).Bytes())
	err = caliopen.Facilities.RESTfacility.CreateContact(contact)
	if err != nil {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		ctx.JSON(http.StatusOK, struct{ Location string }{
			http_middleware.RoutePrefix + http_middleware.ContactsRoute + "/" + contact.ContactId.String(),
		})
	}
	return
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
