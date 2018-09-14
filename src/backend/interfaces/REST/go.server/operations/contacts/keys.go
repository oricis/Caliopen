/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package contacts

import (
	"bytes"
	"encoding/base64"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
	"strconv"
)

// NewPublicKey handles POST …/contacts/:contactID/publickeys
func NewPublicKey(ctx *gin.Context) {
	// check payload
	userId := ctx.MustGet("user_id").(string)
	userId, err := operations.NormalizeUUIDstring(userId)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contactId := ctx.Param("contactID")
	if contactId == "" {
		e := swgErr.New(http.StatusUnprocessableEntity, "empty contactID")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contactId, err = operations.NormalizeUUIDstring(contactId)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contact, err := caliopen.Facilities.RESTfacility.RetrieveContact(userId, contactId)
	if err != nil {
		e := swgErr.New(http.StatusNotFound, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	payload := struct {
		Label string
		Key   string
	}{}
	err = ctx.ShouldBindJSON(&payload)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	rawKey, err := base64.StdEncoding.DecodeString(payload.Key)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// call API
	pubkey, apiErr := caliopen.Facilities.RESTfacility.CreatePGPPubKey(payload.Label, rawKey, contact)
	if apiErr != nil {
		returnedErr := new(swgErr.CompositeError)
		switch apiErr.Code() {
		case UnprocessableCaliopenErr:
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusUnprocessableEntity, "api returned unprocessable error"), apiErr, apiErr.Cause())
		case DbCaliopenErr:
			if prevErr, ok := apiErr.Cause().(CaliopenError); ok {
				switch prevErr.Code() {
				case ForbiddenCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusForbidden, "api returned forbidden error"), apiErr, apiErr.Cause())
				case NotFoundCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "api failed to retrieve in store"), apiErr, apiErr.Cause())
				default:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), apiErr, apiErr.Cause())
				}
			} else {
				returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), apiErr, apiErr.Cause())
			}
		default:
			returnedErr = swgErr.CompositeValidationError(apiErr, apiErr.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
	} else {
		ctx.JSON(http.StatusOK, struct {
			Location    string `json:"location"`
			PublicKeyID string `json:"publickey_id"`
		}{
			http_middleware.RoutePrefix + http_middleware.ContactsRoute + "/" + contactId + "/publickeys/" + pubkey.KeyId.String(),
			pubkey.KeyId.String(),
		})
	}
	return

}

// GetPubKeys handles GET …/contacts/:contactID/publickeys
func GetPubKeys(ctx *gin.Context) {
	// check payload
	userId := ctx.MustGet("user_id").(string)
	userId, err := operations.NormalizeUUIDstring(userId)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contactId := ctx.Param("contactID")
	if contactId == "" {
		e := swgErr.New(http.StatusUnprocessableEntity, "empty contactID")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	contactId, err = operations.NormalizeUUIDstring(contactId)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// call API
	keys, apiErr := caliopen.Facilities.RESTfacility.RetrieveContactPubKeys(userId, contactId)
	if apiErr != nil {
		returnedErr := new(swgErr.CompositeError)
		switch apiErr.Code() {
		case UnprocessableCaliopenErr:
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusUnprocessableEntity, "api returned unprocessable error"), apiErr, apiErr.Cause())
		case DbCaliopenErr:
			if prevErr, ok := apiErr.Cause().(CaliopenError); ok {
				switch prevErr.Code() {
				case ForbiddenCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusForbidden, "api returned forbidden error"), apiErr, apiErr.Cause())
				case NotFoundCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "api failed to retrieve in store"), apiErr, apiErr.Cause())
				default:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), apiErr, apiErr.Cause())
				}
			} else {
				returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), apiErr, apiErr.Cause())
			}
		default:
			returnedErr = swgErr.CompositeValidationError(apiErr, apiErr.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
	} else {
		var respBuf bytes.Buffer
		respBuf.WriteString("{\"total\": " + strconv.Itoa(len(keys)) + ", ")
		respBuf.WriteString("\"pubkeys\":[")
		first := true
		for _, pubkey := range keys {
			jsonKey, err := pubkey.MarshalFrontEnd()
			if err == nil {
				if first {
					first = false
				} else {
					respBuf.WriteByte(',')
				}
				respBuf.Write(jsonKey)
			}
		}
		respBuf.WriteString("]}")

		ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
	}
}
