/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"time"
)

func (cb *CassandraBackend) PutNotificationInQueue(notif *Notification) error {

	var ttl NotificationTTL

	err := cb.Session.Query(`SELECT * FROM notification_ttl WHERE ttl_code = ?`, notif.TTLcode).Scan(&ttl.TTLcode, &ttl.Description, &ttl.TTLduration)
	if err != nil {
		log.Error(err)
		return err
	}

	notifT := cb.IKeyspace.Table("notification", &NotificationModel{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "timestamp_", "id"},
	}).WithOptions(gocassa.Options{TableName: "notification"})

	n := NotificationModel{
		Body:      notif.Body,
		Emitter:   notif.Emitter,
		Id:        notif.Id.String(),
		Reference: notif.Reference,
		Timestamp: notif.Timestamp,
		Type:      notif.Type,
		UserId:    notif.User.UserId.String(),
	}

	return notifT.Set(&n).WithOptions(gocassa.Options{TTL: time.Duration(ttl.TTLduration) * time.Second}).Run()
}
