package users

import (
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// POST …/users/
func Create(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
	return
}

func Get(ctx *gin.Context) {
	ctx.AbortWithStatus(http.StatusNotImplemented)
	return
}
