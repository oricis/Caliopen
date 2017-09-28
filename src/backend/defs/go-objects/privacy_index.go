// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"time"
)

type PrivacyIndex struct {
	Comportment int       `cql:"comportment"    json:"comportment"`
	Context     int       `cql:"context"        json:"context"`
	DateUpdate  time.Time `cql:"date_update"    json:"date_update"`
	Technic     int       `cql:"technic"        json:"technic"`
	Version     int       `cql:"version"        json:"version"`
}

func (pi *PrivacyIndex) UnmarshalMap(input map[string]interface{}) error {

	pi_comp, _ := input["comportment"].(float64)
	pi.Comportment = int(pi_comp)

	pi_ctx, _ := input["context"].(float64)
	pi.Context = int(pi_ctx)

	if date, ok := input["date_update"]; ok {
		pi.DateUpdate, _ = time.Parse(time.RFC3339Nano, date.(string))
	}

	pi_tech, _ := input["technic"].(float64)
	pi.Technic = int(pi_tech)

	pi_ver, _ := input["version"].(float64)
	pi.Version = int(pi_ver)
	return nil //TODO: errors handling
}
