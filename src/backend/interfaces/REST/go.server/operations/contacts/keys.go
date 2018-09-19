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
	"github.com/satori/go.uuid"
	"io/ioutil"
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

	// check if contact exist to return relevant error
	if !caliopen.Facilities.RESTfacility.ContactExists(userId, contactId) {
		e := swgErr.New(http.StatusNotFound, "contact not found")
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

// GetPubKey handles GET …/contacts/:contactID/publickeys/:pubkeyID
func GetPubKey(ctx *gin.Context) {
	// check payload
	userId := ctx.MustGet("user_id").(string)
	userId, err1 := operations.NormalizeUUIDstring(userId)
	contactId := ctx.Param("contactID")
	contactId, err2 := operations.NormalizeUUIDstring(contactId)
	pubkeyId := ctx.Param("pubkeyID")
	pubkeyId, err3 := operations.NormalizeUUIDstring(pubkeyId)
	if err1 != nil || err2 != nil || err3 != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, "invalid uuid")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// check if contact exist to return relevant error
	if !caliopen.Facilities.RESTfacility.ContactExists(userId, contactId) {
		e := swgErr.New(http.StatusNotFound, "contact not found")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// call API
	pubkey, err := caliopen.Facilities.RESTfacility.RetrievePubKey(userId, contactId, pubkeyId)
	if err != nil {
		returnedErr := new(swgErr.CompositeError)
		switch err.Code() {
		case UnprocessableCaliopenErr:
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusUnprocessableEntity, "api returned unprocessable error"), err, err.Cause())
		case DbCaliopenErr:
			if prevErr, ok := err.Cause().(CaliopenError); ok {
				switch prevErr.Code() {
				case ForbiddenCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusForbidden, "api returned forbidden error"), err, err.Cause())
				case NotFoundCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "api failed to retrieve in store"), err, err.Cause())
				default:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), err, err.Cause())
				}
			} else {
				returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), err, err.Cause())
			}
		default:
			returnedErr = swgErr.CompositeValidationError(err, err.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
		return
	}

	key_json, e := pubkey.MarshalFrontEnd()
	if e != nil {
		se := swgErr.New(http.StatusFailedDependency, e.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, se)
		ctx.Abort()
	} else {
		ctx.Data(http.StatusOK, "application/json; charset=utf-8", key_json)
	}
}

// PatchPubKey handles PATCH …/contacts/:contactID/publickeys/:pubkeyID
func PatchPubKey(ctx *gin.Context) {
	// check payload
	userId := ctx.MustGet("user_id").(string)
	userId, err1 := operations.NormalizeUUIDstring(userId)
	contactId := ctx.Param("contactID")
	contactId, err2 := operations.NormalizeUUIDstring(contactId)
	pubkeyId := ctx.Param("pubkeyID")
	pubkeyId, err3 := operations.NormalizeUUIDstring(pubkeyId)
	if err1 != nil || err2 != nil || err3 != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, "invalid uuid")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	var patch []byte
	patch, err := ioutil.ReadAll(ctx.Request.Body)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// check if contact exist to return relevant error
	if !caliopen.Facilities.RESTfacility.ContactExists(userId, contactId) {
		e := swgErr.New(http.StatusNotFound, "contact not found")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	caliopenErr := caliopen.Facilities.RESTfacility.PatchPubKey(patch, userId, contactId, pubkeyId)
	if caliopenErr != nil {
		returnedErr := new(swgErr.CompositeError)
		switch caliopenErr.Code() {
		case UnprocessableCaliopenErr:
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusUnprocessableEntity, "api returned unprocessable error"), caliopenErr, caliopenErr.Cause())
		case DbCaliopenErr:
			if prevErr, ok := caliopenErr.Cause().(CaliopenError); ok {
				switch prevErr.Code() {
				case ForbiddenCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusForbidden, "api returned forbidden error"), caliopenErr, caliopenErr.Cause())
				case NotFoundCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "api failed to retrieve in store"), caliopenErr, caliopenErr.Cause())
				default:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), caliopenErr, caliopenErr.Cause())
				}
			} else {
				returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), caliopenErr, caliopenErr.Cause())
			}
		default:
			returnedErr = swgErr.CompositeValidationError(caliopenErr, caliopenErr.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
		return
	} else {
		ctx.Status(http.StatusNoContent)
	}
}

// DeletePubKey handles DELETE …/contacts/:contactID/publickeys/:pubkeyID
func DeletePubKey(ctx *gin.Context) {
	// check payload
	userId := ctx.MustGet("user_id").(string)
	userId, err1 := operations.NormalizeUUIDstring(userId)
	contactId := ctx.Param("contactID")
	contactId, err2 := operations.NormalizeUUIDstring(contactId)
	pubkeyId := ctx.Param("pubkeyID")
	pubkeyId, err3 := operations.NormalizeUUIDstring(pubkeyId)
	if err1 != nil || err2 != nil || err3 != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, "invalid uuid")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// check if contact exist to return relevant error
	if !caliopen.Facilities.RESTfacility.ContactExists(userId, contactId) {
		e := swgErr.New(http.StatusNotFound, "contact not found")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	// call API
	pubkey := &PublicKey{
		KeyId:      UUID(uuid.FromStringOrNil(pubkeyId)),
		ResourceId: UUID(uuid.FromStringOrNil(contactId)),
		UserId:     UUID(uuid.FromStringOrNil(userId)),
	}
	err := caliopen.Facilities.RESTfacility.DeletePubKey(pubkey)
	if err != nil {
		returnedErr := new(swgErr.CompositeError)
		switch err.Code() {
		case UnprocessableCaliopenErr:
			returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusUnprocessableEntity, "api returned unprocessable error"), err, err.Cause())
		case DbCaliopenErr:
			if prevErr, ok := err.Cause().(CaliopenError); ok {
				switch prevErr.Code() {
				case ForbiddenCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusForbidden, "api returned forbidden error"), err, err.Cause())
				case NotFoundCaliopenErr:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusNotFound, "api failed to retrieve in store"), err, err.Cause())
				default:
					returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), err, err.Cause())
				}
			} else {
				returnedErr = swgErr.CompositeValidationError(swgErr.New(http.StatusFailedDependency, "api failed to call store"), err, err.Cause())
			}
		default:
			returnedErr = swgErr.CompositeValidationError(err, err.Cause())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, returnedErr)
		ctx.Abort()
	} else {
		ctx.Status(http.StatusNoContent)
	}
}
