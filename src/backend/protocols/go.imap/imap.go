/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-imap"
)

// ImapFetcherHeaders are headers added to emails fetched from remote IMAP
type ImapFetcherHeaders map[string]string

// MashalImap build RFC5322 mail from imap.Message and add `X-Fetched` headers.
// func returns an Email suitable to send to our email broker
func MarshalImap(message *imap.Message, xHeaders ImapFetcherHeaders) (mail *Email, err error) {
	log.Info(message.Flags)
	return
}
