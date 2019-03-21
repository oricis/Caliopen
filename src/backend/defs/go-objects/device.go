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
	"sort"
	"strings"
	"sync"
	"time"
)

type Device struct {
	// PRIMARY KEYS (user_id, device_id)
	Locker          *sync.Mutex      `cql:"-"                json:"-"`
	DateInsert      time.Time        `cql:"date_insert"      json:"date_insert,omitempty"      patch:"system"        formatter:"RFC3339Milli"`
	DateRevoked     time.Time        `cql:"date_revoked"     json:"date_revoked,omitempty"     patch:"system"        formatter:"RFC3339Milli"`
	DeviceId        UUID             `cql:"device_id"        json:"device_id"                  patch:"system"`
	IpCreation      string           `cql:"ip_creation"      json:"ip_creation"                patch:"user"`
	Locations       DeviceLocations  `cql:"-"                json:"locations,omitempty"        patch:"user"`
	Name            string           `cql:"name"             json:"name"                       patch:"user"`
	PrivacyFeatures *PrivacyFeatures `cql:"privacy_features" json:"privacy_features,omitempty" patch:"user"`
	PrivacyIndex    *PrivacyIndex    `cql:"pi"               json:"pi,omitempty"               patch:"system"`
	PublicKeys      PublicKeys       `cql:"-"                json:"public_keys,omitempty"      patch:"user"`
	Status          string           `cql:"status"           json:"status,omitempty"           patch:"system"`
	Type            string           `cql:"type"             json:"type,omitempty"             patch:"user"`
	UserAgent       string           `cql:"user_agent"       json:"user_agent"                 patch:"system"`
	UserId          UUID             `cql:"user_id"          json:"user_id"                    patch:"system"`
}

// payload for triggering a device validation process for an end-user
type DeviceValidationRequest struct {
	DeviceId UUID   `json:"device_id"`
	Channel  string `json:"channel"`
}

// UnmarshalCQLMap hydrates a Device with data from a map[string]interface{}
// typical usage is for unmarshaling response from Cassandra backend
func (d *Device) UnmarshalCQLMap(input map[string]interface{}) {
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		d.DateInsert = dateInsert
	}
	if deviceId, ok := input["device_id"].(gocql.UUID); ok {
		d.DeviceId.UnmarshalBinary(deviceId.Bytes())
	}
	if ipCreation, ok := input["ip_creation"].(string); ok {
		d.IpCreation = ipCreation
	}
	// locations are stored in another table
	if name, ok := input["name"].(string); ok {
		d.Name = name
	}
	if i_pf, ok := input["privacy_features"].(map[string]string); ok && i_pf != nil {
		pf := PrivacyFeatures{}
		for k, v := range i_pf {
			pf[k] = v
		}
		d.PrivacyFeatures = &pf

	} else {
		d.PrivacyFeatures = nil
	}
	if i_pi, ok := input["pi"].(map[string]interface{}); ok && i_pi != nil {
		pi := PrivacyIndex{}
		pi.Comportment, _ = i_pi["comportment"].(int)
		pi.Context, _ = i_pi["context"].(int)
		pi.DateUpdate, _ = i_pi["date_update"].(time.Time)
		pi.Technic, _ = i_pi["technic"].(int)
		pi.Version, _ = i_pi["version"].(int)
		d.PrivacyIndex = &pi
	} else {
		d.PrivacyIndex = nil
	}

	// publicKeys are stored in another table

	if revokedAt, ok := input["revoked_at"].(time.Time); ok {
		d.DateRevoked = revokedAt
	}
	if status, ok := input["status"].(string); ok {
		d.Status = status
	}
	if i_type, ok := input["type"].(string); ok {
		d.Type = i_type
	}
	if userAgent, ok := input["user_agent"].(string); ok {
		d.UserAgent = userAgent
	}
	if userId, ok := input["user_id"].(gocql.UUID); ok {
		d.UserId.UnmarshalBinary(userId.Bytes())
	}
}

// UnmarshalMap hydrates a Device with data from a map[string]interface{}
func (d *Device) UnmarshalMap(input map[string]interface{}) error {
	if dateInsert, ok := input["date_insert"]; ok {
		d.DateInsert, _ = time.Parse(time.RFC3339Nano, dateInsert.(string))
	}
	if deviceId, ok := input["device_id"].(string); ok {
		if id, err := uuid.FromString(deviceId); err == nil {
			d.DeviceId.UnmarshalBinary(id.Bytes())
		}
	}
	if ipCreation, ok := input["ip_creation"].(string); ok {
		d.IpCreation = ipCreation
	}

	if locations, ok := input["locations"]; ok && locations != nil {
		d.Locations = DeviceLocations{}
		for _, location := range locations.([]interface{}) {
			L := new(DeviceLocation)
			if err := L.UnmarshalMap(location.(map[string]interface{})); err == nil {
				d.Locations = append(d.Locations, *L)
			}
		}
	}
	if name, ok := input["name"].(string); ok {
		d.Name = name
	}
	if i_pf, ok := input["privacy_features"]; ok && i_pf != nil {
		pf := &PrivacyFeatures{}
		pf.UnmarshalMap(i_pf.(map[string]interface{}))
		d.PrivacyFeatures = pf

	}
	if i_pi, ok := input["pi"]; ok && i_pi != nil {
		pi := new(PrivacyIndex)
		if err := pi.UnmarshalMap(i_pi.(map[string]interface{})); err == nil {
			d.PrivacyIndex = pi
		}
	}
	if pks, ok := input["public_keys"]; ok && pks != nil {
		d.PublicKeys = PublicKeys{}
		for _, pk := range pks.([]interface{}) {
			K := new(PublicKey)
			if err := K.UnmarshalMap(pk.(map[string]interface{})); err == nil {
				d.PublicKeys = append(d.PublicKeys, *K)
			}
		}
	}
	if revokedAt, ok := input["revoked_at"]; ok {
		d.DateRevoked, _ = time.Parse(time.RFC3339Nano, revokedAt.(string))
	}
	if status, ok := input["status"].(string); ok {
		d.Status = status
	}
	if i_type, ok := input["type"].(string); ok {
		d.Type = i_type
	}
	if userAgent, ok := input["user_agent"].(string); ok {
		d.UserAgent = userAgent
	}
	if userId, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userId); err == nil {
			d.UserId.UnmarshalBinary(id.Bytes())
		}
	}

	return nil
}

func (d *Device) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return d.UnmarshalMap(input)
}

// return a JSON representation of Device suitable for frontend client
func (d *Device) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", d)
}

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaller takes account of custom tags for given 'context'
func (d *Device) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", d)
}

func (d *Device) NewEmpty() interface{} {
	nd := new(Device)
	nd.Locations = DeviceLocations{}
	return nd
}

func (d *Device) MarshallNew(args ...interface{}) {
	if len(d.DeviceId) == 0 || (bytes.Equal(d.DeviceId.Bytes(), EmptyUUID.Bytes())) {
		d.DeviceId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if len(d.UserId) == 0 || (bytes.Equal(d.UserId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				d.UserId = args[0].(UUID)
			}
		}
	}
	if d.DateInsert.IsZero() {
		d.DateInsert = time.Now()
	}
	d.DateRevoked = time.Time{}

	for i := range d.Locations {
		d.Locations[i].MarshallNew()
	}

	if strings.TrimSpace(d.Type) == "" {
		d.Type = DefaultDeviceType()
	}
}

func (d *Device) JsonTags() map[string]string {
	return jsonTags(d)
}

func (d *Device) SortSlices() {
	sort.Sort(ByIpAddress(d.Locations))
}

// GetRelatedList returns a map[PropertyKey]Type of structs that are embedded into a Device from joined tables
func (d *Device) GetRelatedList() map[string]interface{} {
	return map[string]interface{}{
		"Locations": &DeviceLocation{},
		//"PublicKey": &PublicKey{},
	}
}

func (d *Device) GetSetRelated() <-chan interface{} {
	getSet := make(chan interface{})
	if d.Locker == nil {
		d.Locker = new(sync.Mutex)
	}
	go func(*sync.Mutex, chan interface{}) {
		d.Locker.Lock()

		// send locations
		for i := range d.Locations {
			getSet <- &(d.Locations[i])
		}

		// send publicKeys
		for i := range d.PublicKeys {
			getSet <- &(d.PublicKeys[i])
		}

		// all done
		close(getSet)
		d.Locker.Unlock()
	}(d.Locker, getSet)

	return getSet
}

// IsValidDeviceType checks the `t` string against the constant `DeviceTypes`
// returns true if `t` is a valid type for a device.
func IsValidDeviceType(t string) bool {
	for _, typ := range DeviceTypes {
		if typ == t {
			return true
		}
	}
	return false
}

// DefaultDeviceType returns the first type found within `DeviceTypes` constant
// which should be the default one.
func DefaultDeviceType() string {
	return DeviceTypes[0]
}
