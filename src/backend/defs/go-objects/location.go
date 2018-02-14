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
	// PRIMARY KEYS (user_id, device_id, ip_address)
	Country   string `cql:"country"          json:"country,omitempty"       patch:"user"`
	DeviceId  UUID   `cql:"device_id"        json:"device_id"               patch:"user"`
	IpAddress string `cql:"address"          json:"address,omitempty"       patch:"user"`
	Type      string `cql:"type"             json:"type,omitempty"          patch:"user"`
	UserId    UUID   `cql:"user_id"          json:"user_id"                 patch:"system"`
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
	if ipAddress, ok := input["address"].(string); ok {
		dl.IpAddress = ipAddress
	}
	if i_type, ok := input["type"].(string); ok {
		dl.Type = i_type
	}
	if userId, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userId); err == nil {
			dl.UserId.UnmarshalBinary(id.Bytes())
		}
	}
	return nil
}

func (dl *DeviceLocation) UnmarshalCQLMap(input map[string]interface{}) {
	if country, ok := input["country"].(string); ok {
		dl.Country = country
	}
	if deviceId, ok := input["device_id"].(gocql.UUID); ok {
		dl.DeviceId.UnmarshalBinary(deviceId.Bytes())
	}
	if ipAddress, ok := input["address"].(string); ok {
		dl.IpAddress = ipAddress
	}
	if i_type, ok := input["type"].(string); ok {
		dl.Type = i_type
	}
	if userId, ok := input["user_id"].(gocql.UUID); ok {
		dl.UserId.UnmarshalBinary(userId.Bytes())
	}
}

// GetTableInfos implements HasTable interface.
// It returns params needed by CassandraBackend to CRUD on location table.
func (dl *DeviceLocation) GetTableInfos() (table string, partitionKeys map[string]string, clusteringKeys map[string]string) {
	return "device_location",
		map[string]string{
			"UserId":    "user_id",
			"DeviceId":  "device_id",
			"IpAddress": "address",
		},
		map[string]string{
			"UserId":   "user_id",
			"DeviceId": "device_id",
		}
}

// MarshalNew could have a *Device has first argument
func (dl *DeviceLocation) MarshallNew(args ...interface{}) {
	if len(dl.DeviceId) == 0 || (bytes.Equal(dl.DeviceId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case *Device:
				dl.DeviceId = args[0].(*Device).DeviceId
			}
		}
	}
	if len(dl.UserId) == 0 || (bytes.Equal(dl.UserId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case *Device:
				dl.UserId = args[0].(*Device).UserId
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
