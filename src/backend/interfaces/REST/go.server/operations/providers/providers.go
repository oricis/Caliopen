package providers

import (
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/gin-gonic/gin"
	"net/http"
	swgErr "github.com/go-openapi/errors"
)

// GetProvidersList handles get …/providers
func GetProvidersList(ctx *gin.Context) {
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
	return
}

// GetProvider handles get …/providers/:provider_name
func GetProvider(ctx *gin.Context) {
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
	return
}

// CallbackHandler handles get …/providers/:provider_name/callback
func CallbackHandler(ctx *gin.Context) {
	e := swgErr.New(http.StatusNotImplemented, "not implemented")
	http_middleware.ServeError(ctx.Writer, ctx.Request, e)
	ctx.Abort()
	return
}