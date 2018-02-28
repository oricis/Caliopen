/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package Notifications

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// AddNotifToQueue adds a new notification into the notification queue
func (notifier *Notifier) AddNotifToQueue(notif *Notification) error {

	return nil
}

// DelNotifFromQueue deletes one notification from queue
func (notifier *Notifier) DelNotifFromQueue(notif *Notification) error {

	return nil
}

// ClearNotifQueue deletes pending notification for an user within the time frame specified in `bounds` param
func (notifier *Notifier) ClearNotifQueue(user *User, bounds []int) error {

	return nil
}

// ByNotifQueue nofifies an user by the mean of the notification queue
func (notifier *Notifier) ByNotifQueue(*Notification) error {

	return nil
}
