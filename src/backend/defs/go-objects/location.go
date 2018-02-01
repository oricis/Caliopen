/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

type DeviceLocation struct {
	// PRIMARY KEYS (device_id, ip_address)
	Country         string          `cql:"country"          json:"country,omitempty"`
	DeviceId        UUID            `cql:"device_id"        json:"device_id"`
	IpAddress       string          `cql:"ip_address"       json:"ip_address,omitempty"`
	PrivacyFeatures PrivacyFeatures `cql:"privacy_features" json:"privacy_features,omitempty"`
	Type            string          `cql:"type"             json:"type,omitempty"`
}

type DeviceLocations []DeviceLocation

func (dl *DeviceLocation) UnmarshalMap(input map[string]interface{}) error {

}

func (dl *DeviceLocation) MarshallNew(args ...interface{}) {

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
