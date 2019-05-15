// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package participants

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

// POST …/participants/discussion
// returns canonical hash of participant_uris and if the corresponding discussion_id exists
func HashUris(ctx *gin.Context) {
	userId := ctx.MustGet("user_id").(string)
	shardId := ctx.MustGet("shard_id").(string)
	userInfo := &UserInfo{User_id: userId, Shard_id: shardId}
	var err error
	var participants []Participant
	ctx.ShouldBindJSON(&participants)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	hash, _, err := HashFromParticipantsUris(participants)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	discussion, err := caliopen.Facilities.RESTfacility.DiscussionMetadata(userInfo, hash)
	if err != nil && err.Error() != "not found" {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}

	var respBuf bytes.Buffer
	respBuf.WriteString("{\"discussion_id\":\"" + discussion.DiscussionId + "\",\"hash\":\"" + hash + "\"}")
	ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
}
