package messages

import (
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.main"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

// json payload on routes …/actions
type REST_order struct {
	Actions []string
}

// POST …/:message_id/actions
func Actions(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	msg_id := ctx.Param("message_id")
	var actions REST_order

	if ctx.BindJSON(&actions) == nil {
		//for now, only "send" action is handled
		if actions.Actions[0] == "send" {
			updated_msg, err := caliopen.Facilities.RESTfacility.SendDraft(user_id, msg_id)
			if err != nil {
				ctx.AbortWithError(http.StatusInternalServerError, err)
				//TODO: returns error conforming to swagger def.
			}
			ctx.JSON(http.StatusOK, updated_msg)
		} else {
			ctx.AbortWithStatus(http.StatusNotImplemented)
		}
	}

}
