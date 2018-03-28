// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/satori/go.uuid"
)

type PostalAddress struct {
	AddressId  UUID   `cql:"address_id"     json:"address_id,omitempty"       patch:"system"`
	City       string `cql:"city"           json:"city,omitempty"             patch:"user"`
	Country    string `cql:"country"        json:"country,omitempty"          patch:"user"`
	IsPrimary  bool   `cql:"is_primary"     json:"is_primary"       patch:"user"`
	Label      string `cql:"label"          json:"label,omitempty"            patch:"user"`
	PostalCode string `cql:"postal_code"    json:"postal_code,omitempty"      patch:"user"`
	Region     string `cql:"region"         json:"region,omitempty"           patch:"user"`
	Street     string `cql:"street"         json:"street,omitempty"           patch:"user"`
	Type       string `cql:"type"           json:"type,omitempty"             patch:"user"`
}

func (pa *PostalAddress) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return pa.UnmarshalMap(input)
}

func (pa *PostalAddress) UnmarshalMap(input map[string]interface{}) error {
	if add_id, ok := input["address_id"].(string); ok {
		if id, err := uuid.FromString(add_id); err == nil {
			pa.AddressId.UnmarshalBinary(id.Bytes())
		}
	}
	if city, ok := input["city"].(string); ok {
		pa.City = city
	}
	if country, ok := input["country"].(string); ok {
		pa.Country = country
	}
	if isPrimary, ok := input["is_primary"].(bool); ok {
		pa.IsPrimary = isPrimary
	}
	if label, ok := input["label"].(string); ok {
		pa.Label = label
	}
	if postalCode, ok := input["postal_code"].(string); ok {
		pa.PostalCode = postalCode
	}
	if region, ok := input["region"].(string); ok {
		pa.Region = region
	}
	if street, ok := input["street"].(string); ok {
		pa.Street = street
	}
	if t, ok := input["type"].(string); ok {
		pa.Type = t
	}

	return nil //TODO: errors handling
}

// MarshallNew must be a variadic func to implement NewMarshaller interface,
// but PostalAddress does not need params to marshal a well-formed PostalAddress: ...interface{} is ignored
func (pa *PostalAddress) MarshallNew(...interface{}) {
	if len(pa.AddressId) == 0 || (bytes.Equal(pa.AddressId.Bytes(), EmptyUUID.Bytes())) {
		pa.AddressId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

// Sort interface implementation
type ByPostalAddressID []PostalAddress

func (p ByPostalAddressID) Len() int {
	return len(p)
}

func (p ByPostalAddressID) Less(i, j int) bool {
	return p[i].AddressId.String() < p[j].AddressId.String()
}

func (p ByPostalAddressID) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
