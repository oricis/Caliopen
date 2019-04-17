// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package participants

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server/middlewares"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/gin-gonic/gin"
	swgErr "github.com/go-openapi/errors"
	"net/http"
)

// POST …/participants/discussion
// returns canonical hash of participant_uris which is the corresponding discussion_id
func HashUris(ctx *gin.Context) {
	var err error
	var participants []Participant
	ctx.ShouldBindJSON(&participants)
	if err != nil {
		e := swgErr.New(http.StatusUnprocessableEntity, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	hash, _, err := helpers.HashFromParticipantsUris(participants)
	if err != nil {
		e := swgErr.New(http.StatusFailedDependency, err.Error())
		http_middleware.ServeError(ctx.Writer, ctx.Request, e)
		ctx.Abort()
		return
	}
	var respBuf bytes.Buffer
	respBuf.WriteString("{\"discussion_id\":\"" + hash + "\",\"hash\":\"" + hash + "\"}")
	ctx.Data(http.StatusOK, "application/json; charset=utf-8", respBuf.Bytes())
}
