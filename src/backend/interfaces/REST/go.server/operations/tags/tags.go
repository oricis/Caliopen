package tags

import (
	"bytes"
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	swgErr "github.com/go-openapi/errors"
	"github.com/pkg/errors"
	"github.com/satori/go.uuid"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
	"strconv"
)

func RetrieveUserTags(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	tags, err := caliopen.Facilities.RESTfacility.RetrieveUserTags(user_id)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		var respBuf bytes.Buffer
		respBuf.WriteString("{\"total\": " + strconv.Itoa(len(tags)) + ",")
		respBuf.WriteString(("\"tags\":["))
		first := true
		for _, tag := range tags {
			json_tag, err := json.Marshal(tag)
			if err == nil {
				if first {
					first = false
				} else {
					respBuf.WriteByte(',')
				}
				respBuf.Write(json_tag)
			}
		}
		respBuf.WriteString("]}")
		ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
	}
}

func CreateTag(ctx *gin.Context) {
	var tag Tag
	if ctx.BindJSON(&tag) == nil {
		user_uuid, _ := uuid.FromString(ctx.MustGet("user_id").(string))
		tag.User_id.UnmarshalBinary(user_uuid.Bytes())
		err := caliopen.Facilities.RESTfacility.CreateTag(&tag)
		if err != nil {
			e := swgErr.New(http.StatusFailedDependency, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
		} else {
			ctx.JSON(http.StatusOK, struct{ Location string }{
				http_middleware.RoutePrefix + http_middleware.TagsRoute + "/" + tag.Tag_id.String(),
			})
		}
	} else {
		err := errors.New("Unable to marshal provided json.")
		e := swgErr.New(http.StatusBadRequest, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}

}

func RetrieveTag(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	tag_id := ctx.Request.URL.Query().Get("tag_id")
	tag, err := caliopen.Facilities.RESTfacility.RetrieveTag(user_id, tag_id)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}
	ctx.JSON(http.StatusOK, tag)
}

func UpdateTag(ctx *gin.Context) {
	ctx.Status(http.StatusNotImplemented)
}

func DeleteTag(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	tag_id := ctx.Request.URL.Query().Get("tag_id")
	err := caliopen.Facilities.RESTfacility.DeleteTag(user_id, tag_id)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		ctx.Status(http.StatusNoContent)
	}
}
