/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package Notifications

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// ByNotifQueue notifies an user by the mean of the notification queue
func (N *Notifier) ByNotifQueue(notif *Notification) CaliopenError {
	N.LogNotification("ByNotificationQueue", notif)

	err := N.store.PutNotificationInQueue(notif)

	if err != nil {
		return WrapCaliopenErr(err, DbCaliopenErr, "[Notifier]ByNotifQueue failed to put notification in queue")
	}
	return nil
}

// DelNotifFromQueue deletes one notification from queue
func (N *Notifier) DelNotifFromQueue(notif *Notification) CaliopenError {

	return nil
}

// ClearNotifQueue deletes pending notification for an user within the time frame specified in `bounds` param
func (N *Notifier) ClearNotifQueue(user *User, bounds []int) CaliopenError {

	return nil
}
