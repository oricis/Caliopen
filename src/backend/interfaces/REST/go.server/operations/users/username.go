package users

import (
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.main"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// GET …/users/isAvailable
func IsAvailable(ctx *gin.Context) {
	username := ctx.Query("username")
	if username == "" {
		//TODO: validate against swagger
		ctx.JSON(http.StatusBadRequest, obj.Availability{false, username})
		return
	}

	available, err := caliopen.Facilities.RESTfacility.UsernameIsAvailable(username)

	if available && err == nil {
		//TODO: validate against swagger
		ctx.JSON(http.StatusOK, obj.Availability{true, username})
		return
	}
	//TODO: validate against swagger
	ctx.JSON(http.StatusOK, obj.Availability{false, username})
}
