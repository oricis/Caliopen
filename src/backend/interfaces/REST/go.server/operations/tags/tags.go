package tags

import (
	"bytes"
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	swgErr "github.com/go-openapi/errors"
	"github.com/pkg/errors"
	"github.com/satori/go.uuid"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/gin-gonic/gin.v1/binding"
	"net/http"
	"strconv"
)

// RetrieveUserTags fetches all tags tied to an user, system tags as well as custom tags.
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
	b := binding.JSON
	if err := b.Bind(ctx.Request, &tag); err == nil {
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
		err := errors.WithMessage(err, "Unable to json marshal the provided payload.")
		e := swgErr.New(http.StatusBadRequest, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}

}

// RetrieveTage fetches a tag with tag_id & user_id
func RetrieveTag(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	tag_id, err := operations.NormalizeUUIDstring(ctx.Param("tag_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	if user_id != "" && tag_id != "" {
		tag, err := caliopen.Facilities.RESTfacility.RetrieveTag(user_id, tag_id)
		if err != nil {
			e := swgErr.New(http.StatusFailedDependency, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
		} else {
			ctx.JSON(http.StatusOK, tag)
		}
	} else {
		err := errors.New("invalid params")
		e := swgErr.New(http.StatusBadRequest, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}
}

func PatchTag(ctx *gin.Context) {
	var err error
	var user_id string
	var tag_id string

	if id, ok := ctx.Get("user_id"); !ok {
		e := swgErr.New(http.StatusUnprocessableEntity, "user_id is missing")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	} else {
		if user_id, err = operations.NormalizeUUIDstring(id.(string)); err != nil {
			e := swgErr.New(http.StatusUnprocessableEntity, "user_id is invalid")
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
	}

	if id, ok := ctx.Get("user_id"); !ok {
		e := swgErr.New(http.StatusUnprocessableEntity, "user_id is missing")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	} else {
		if user_id, err = operations.NormalizeUUIDstring(id.(string)); err != nil {
			e := swgErr.New(http.StatusUnprocessableEntity, "user_id is invalid")
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
			return
		}
	}

	tag_id, err = operations.NormalizeUUIDstring(ctx.Param("tag_id"))
	if err != nil || tag_id == "" {
		e := swgErr.New(http.StatusUnprocessableEntity, "tag_id is invalid or missing")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	var patch []byte
	_, err = ctx.Request.Body.Read(patch)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	err = caliopen.Facilities.RESTfacility.PatchTag(patch, user_id, tag_id)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	} else {
		ctx.Status(http.StatusNoContent)
	}
}

func DeleteTag(ctx *gin.Context) {
	user_id := ctx.MustGet("user_id").(string)
	tag_id, err := operations.NormalizeUUIDstring(ctx.Param("tag_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	if user_id != "" && tag_id != "" {
		err := caliopen.Facilities.RESTfacility.DeleteTag(user_id, tag_id)
		if err != nil {
			e := swgErr.New(http.StatusFailedDependency, err.Error())
			http_middleware.ServeError(ctx.Writer, ctx.Request, e)
			ctx.Abort()
		} else {
			ctx.Status(http.StatusNoContent)
		}
	} else {
		err := errors.New("invalid params")
		e := swgErr.New(http.StatusBadRequest, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}
}
