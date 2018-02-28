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
func (N *Notifier) ByNotifQueue(notif *Notification) error {
	N.LogNotification("ByNotificationQueue", notif)
	return nil
}

// DelNotifFromQueue deletes one notification from queue
func (N *Notifier) DelNotifFromQueue(notif *Notification) error {

	return nil
}

// ClearNotifQueue deletes pending notification for an user within the time frame specified in `bounds` param
func (N *Notifier) ClearNotifQueue(user *User, bounds []int) error {

	return nil
}
