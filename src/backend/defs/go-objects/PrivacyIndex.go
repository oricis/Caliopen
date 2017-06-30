// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import "time"

type PrivacyIndex struct {
	Comportment int       `json:"comportment"`
	Context     int       `json:"context"`
	DateUpdate  time.Time `json:"date_update"`
	Technic     int       `json:"technic"`
	Version     int       `json:"version"`
}
