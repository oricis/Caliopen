// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

//LDA only deals with email
type NotificationsStore interface {
	CreateMessage(msg *Message) error
	UserByUsername(username string) (user *User, err error) // to retrieve admin user
}

type NotificationsIndex interface {
	CreateMessage(msg *Message) error
}
