/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package Notifications

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/Sirupsen/logrus"
)

// ByNotifQueue notifies an user by the mean of the notification queue
func (N *Notifier) ByNotifQueue(notif *Notification) CaliopenError {
	N.LogNotification("ByNotificationQueue", notif)

	err := N.Store.PutNotificationInQueue(notif)

	if err != nil {
		logrus.WithError(err).Errorf("[Notifier]ByNotifQueue failed to put notification in queue")
		return WrapCaliopenErr(err, DbCaliopenErr, "[Notifier]ByNotifQueue failed to put notification in queue")
	}
	return nil
}
