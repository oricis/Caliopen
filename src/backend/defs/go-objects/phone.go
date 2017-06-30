// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

// contacts' phone model
type Phone struct {
	IsPrimary bool   `cql:"is_primary"  json:"is_primary"`
	Number    string `cql:"number"      json:"number"`
	PhoneId   UUID   `cql:"phone_id"    json:"phone_id"`
	Type      string `cql:"type"        json:"type"`
	Uri       string `cql:"uri"         json:"uri"` //RFC3966
}
