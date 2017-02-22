// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"context"
	"github.com/satori/go.uuid"
)

func (es *ElasticSearchBackend) UpdateMessage(msg *objects.MessageModel, fields map[string]interface{}) error {

	msg_id, _ := uuid.FromBytes(msg.Message_id)
	user_id, _ := uuid.FromBytes(msg.User_id)

	update, err := es.Client.Update().Index(user_id.String()).Type("indexed_message").Id(msg_id.String()).
		Doc(fields).
		Do(context.TODO())
	if err != nil {
		log.WithError(err).Warn("backend Index: updateMessage operation failed")
		return err
	}
	log.Infof("New version of indexed msg %s is now %d", update.Id, update.Version)
	return nil
}
