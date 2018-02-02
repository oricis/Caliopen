/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
)

type DeviceLocation struct {
	// PRIMARY KEYS (device_id, ip_address)
	Country         string           `cql:"country"          json:"country,omitempty"`
	DeviceId        UUID             `cql:"device_id"        json:"device_id"`
	IpAddress       string           `cql:"ip_address"       json:"ip_address,omitempty"`
	PrivacyFeatures *PrivacyFeatures `cql:"privacy_features" json:"privacy_features,omitempty"`
	Type            string           `cql:"type"             json:"type,omitempty"`
}

type DeviceLocations []DeviceLocation

func (dl *DeviceLocation) UnmarshalMap(input map[string]interface{}) error {
	if country, ok := input["country"].(string); ok {
		dl.Country = country
	}
	if deviceId, ok := input["device_id"].(string); ok {
		if id, err := uuid.FromString(deviceId); err == nil {
			dl.DeviceId.UnmarshalBinary(id.Bytes())
		}
	}
	if ipAddress, ok := input["ip_address"].(string); ok {
		dl.IpAddress = ipAddress
	}
	if i_pf, ok := input["privacy_features"]; ok && i_pf != nil {
		pf := &PrivacyFeatures{}
		pf.UnmarshalMap(i_pf.(map[string]interface{}))
		dl.PrivacyFeatures = pf

	}
	if i_type, ok := input["type"].(string); ok {
		dl.Type = i_type
	}
	return nil
}

func (dl *DeviceLocation) UnmarshalCQLMap(input map[string]interface{}) error {
	if country, ok := input["country"].(string); ok {
		dl.Country = country
	}
	if deviceId, ok := input["device_id"].(gocql.UUID); ok {
		dl.DeviceId.UnmarshalBinary(deviceId.Bytes())
	}
	if ipAddress, ok := input["ip_address"].(string); ok {
		dl.IpAddress = ipAddress
	}
	if i_pf, ok := input["privacy_features"].(map[string]string); ok && i_pf != nil {
		pf := PrivacyFeatures{}
		for k, v := range i_pf {
			pf[k] = v
		}
		dl.PrivacyFeatures = &pf

	} else {
		dl.PrivacyFeatures = nil
	}
	if i_type, ok := input["type"].(string); ok {
		dl.Type = i_type
	}
	return nil
}

func (dl *DeviceLocation) MarshallNew(args ...interface{}) {
	nullID := new(UUID)

	if len(dl.DeviceId) == 0 || (bytes.Equal(dl.DeviceId.Bytes(), nullID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				dl.DeviceId = args[0].(UUID)
			}
		}
	}
}

func (dl *DeviceLocation) NewEmpty() interface{} {
	return new(DeviceLocation)
}

func (dl *DeviceLocation) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return dl.UnmarshalMap(input)
}

func (dl *DeviceLocation) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", dl)
}

func (dl *DeviceLocation) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", dl)
}

func (dl *DeviceLocation) JsonTags() map[string]string {
	return jsonTags(dl)
}

func (dl *DeviceLocation) SortSlices() {
	//nothing to sort
}

// Sort interface implementation
type ByIpAddress []DeviceLocation

func (a ByIpAddress) Len() int {
	return len(a)
}

func (a ByIpAddress) Less(i, j int) bool {
	return a[i].IpAddress < a[j].IpAddress
}

func (a ByIpAddress) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
