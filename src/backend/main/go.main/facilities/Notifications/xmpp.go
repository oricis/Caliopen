/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package Notifications

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// ByXMPP notifies an user by the mean of XMPP facility
func (N *Notifier) ByXMPP(notif *Notification) error {
	return errors.New("not implemented")
}
