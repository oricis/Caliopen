// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"github.com/satori/go.uuid"
)

// contact's instant messaging address model
type IM struct {
	Address   string `cql:"address"     json:"address"      cql_lookup:"contact_lookup"`
	IMId      UUID   `cql:"im_id"       json:"im_id"`
	IsPrimary bool   `cql:"is_primary"  json:"is_primary"`
	Label     string `cql:"label"       json:"label"`
	Protocol  string `cql:"protocol"    json:"protocol"`
	Type      string `cql:"type"        json:"type"`
}

func (i *IM) UnmarshalMap(input map[string]interface{}) error {
	i.Address, _ = input["address"].(string)
	if im_id, ok := input["im_id"].(string); ok {
		if id, err := uuid.FromString(im_id); err == nil {
			i.IMId.UnmarshalBinary(id.Bytes())
		}
	}
	i.IsPrimary, _ = input["is_primary"].(bool)
	i.Label, _ = input["label"].(string)
	i.Protocol, _ = input["protocol"].(string)
	i.Type, _ = input["type"].(string)

	return nil //TODO: errors handling
}

// MarshallNew must be a variadic func to implement NewMarshaller interface,
// but IM does not need params to marshal a well-formed IM: ...interface{} is ignored
func (i *IM) MarshallNew(...interface{}) {
	if len(i.IMId) == 0 || (bytes.Equal(i.IMId.Bytes(), EmptyUUID.Bytes())) {
		i.IMId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

// Sort interface implementation
type ByIMID []IM

func (p ByIMID) Len() int {
	return len(p)
}

func (p ByIMID) Less(i, j int) bool {
	return p[i].IMId.String() < p[j].IMId.String()
}

func (p ByIMID) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
