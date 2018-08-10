/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"errors"
)

type Sender struct{}

func (s *Sender) SendDraft(order IMAPsendOrder) error {

	return errors.New("not implemented")
}
