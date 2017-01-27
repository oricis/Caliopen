package users

import (
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.main"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// POST …/users/
func Create(caliop caliopen.RESTservices, ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
	return
}

func Get(caliop caliopen.RESTservices, ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
	return
}
