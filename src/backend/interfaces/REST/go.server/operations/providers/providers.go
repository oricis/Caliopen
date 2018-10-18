package providers

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

// GetProvidersList handles get …/providers
func GetProvidersList(ctx *gin.Context) {
	providers, err := caliopen.Facilities.RESTfacility.RetrieveProvidersList()
	if err != nil && err.Error() != "not found" {
		e := swgErr.New(http.StatusInternalServerError, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ret := struct {
		Total     int        `json:"total"`
		Providers []Provider `json:"providers,omitempty"`
	}{len(providers), providers}
	ctx.JSON(http.StatusOK, ret)
}

// GetProvider handles get …/providers/:provider_name
func GetProvider(ctx *gin.Context) {
	userID, err := operations.NormalizeUUIDstring(ctx.GetString("user_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	provider, err := caliopen.Facilities.RESTfacility.RetrieveProvider(userID, ctx.Param("provider_name"))
	if err != nil {
		var e error
		switch err.Error() {
		case "not found":
			e = swgErr.New(http.StatusNotFound, "not found")
		default:
			e = swgErr.New(http.StatusInternalServerError, err.Error())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ctx.JSON(http.StatusOK, provider)
}

// CallbackHandler handles get …/providers/:provider_name/callback
func CallbackHandler(ctx *gin.Context) {
	switch ctx.Param("provider_name") {
	case "twitter":
		token := ctx.Query("oauth_token")
		verifier := ctx.Query("oauth_verifier")
		remoteId, err := caliopen.Facilities.RESTfacility.CreateTwitterIdentity(token, verifier)
		if err != nil {
			e := swgErr.New(http.StatusInternalServerError, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
		response := fmt.Sprintf(`{"identity_id":"%s"}`, remoteId)
		ctx.Data(http.StatusOK, "application/json", []byte(response))
	default:
		e := swgErr.New(http.StatusNotImplemented, "not implemented")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

}
