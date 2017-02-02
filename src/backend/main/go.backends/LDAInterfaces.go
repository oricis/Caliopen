// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

type LDABackend interface {
	GetRecipients([]string) ([]string, error)
	StoreRaw(data string) (raw_id string, err error)
}
