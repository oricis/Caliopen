package providers

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
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
	provider, err := caliopen.Facilities.RESTfacility.RetrieveProvider(ctx.Param("provider_name"))
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
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
	return
}
