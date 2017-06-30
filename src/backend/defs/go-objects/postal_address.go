// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type PostalAddress struct {
	AddressId  UUID   `cql:"address_id"     json:"address_id"`
	City       string `cql:"city"           json:"city"`
	Country    string `cql:"country"        json:"country"`
	IsPrimary  bool   `cql:"is_primary"     json:"is_primary"`
	Label      string `cql:"label"          json:"label"`
	PostalCode string `cql:"postal_code"    json:"postal_code"`
	Region     string `cql:"region"         json:"region"`
	Street     string `cql:"street"         json:"street"`
	Type       string `cql:"type"           json:"type"`
}
