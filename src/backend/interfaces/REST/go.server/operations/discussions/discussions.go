// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package discussions

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/operations"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
	"strconv"
)

// GET …/discussions
func GetDiscussionsList(ctx *gin.Context) {
	// temporary hack to check if X-Caliopen-IL header is in request, because go-openapi pkg fails to do it.
	// (NB : CanonicalHeaderKey func normalize http headers with uppercase at beginning of words)
	if _, ok := ctx.Request.Header["X-Caliopen-Il"]; !ok {
		e := swgErr.New(http.StatusFailedDependency, "Missing mandatory header 'X-Caliopen-Il'.")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	ILrange := operations.GetImportanceLevel(ctx)
	// temporary hack to check if X-Caliopen-IL header is in request, because go-openapi pkg fails to do it.
	// (NB : CanonicalHeaderKey func normalize http headers with uppercase at beginning of words)
	if _, ok := ctx.Request.Header["X-Caliopen-Pi"]; !ok {
		e := swgErr.New(http.StatusFailedDependency, "Missing mandatory header 'X-Caliopen-PI'.")
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	PIrange := operations.GetPrivacyIndex(ctx)
	userId, err := operations.NormalizeUUIDstring(ctx.GetString("user_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}
	shardId := ctx.MustGet("shard_id").(string)
	userInfo := &UserInfo{User_id: userId, Shard_id: shardId}
	var limit, offset int
	query_values := ctx.Request.URL.Query()
	if l, ok := query_values["limit"]; ok {
		limit, _ = strconv.Atoi(l[0])
		query_values.Del("limit")
	}
	if o, ok := query_values["offset"]; ok {
		offset, _ = strconv.Atoi(o[0])
		query_values.Del("offset")
	}

	list, totalFound, err := caliopen.Facilities.RESTfacility.GetDiscussionsList(userInfo, ILrange, PIrange, limit, offset)
	if err != nil && err.Error() != "not found" {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	var respBuf bytes.Buffer
	respBuf.WriteString("{\"total\": " + strconv.FormatInt(int64(totalFound), 10) + ",")
	respBuf.WriteString("\"discussions\":[")
	first := true
	for _, disc := range list {
		json_disc, err := disc.MarshalFrontEnd()
		if err == nil {
			if first {
				first = false
			} else {
				respBuf.WriteByte(',')
			}
			respBuf.Write(json_disc)
		}
	}
	respBuf.WriteString("]}")
	ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
}

// GET …/discussions/:discussionId
func GetDiscussion(ctx *gin.Context) {
	userId, err := operations.NormalizeUUIDstring(ctx.GetString("user_id"))
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	}
	shardId := ctx.MustGet("shard_id").(string)
	userInfo := &UserInfo{User_id: userId, Shard_id: shardId}
	discussion, err := caliopen.Facilities.RESTfacility.DiscussionMetadata(userInfo, ctx.Param("discussionId"))
	if err != nil {
		var e error
		if err.Error() == "not found" {
			e = swgErr.New(http.StatusNotFound, err.Error())
		} else {
			e = swgErr.New(http.StatusFailedDependency, err.Error())
		}
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	disc_json, err := discussion.MarshalFrontEnd()
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
	} else {
		ctx.Data(http.StatusOK, "application/json; charset=utf-8", disc_json)
	}
}
