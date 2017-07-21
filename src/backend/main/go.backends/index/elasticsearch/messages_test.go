// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/satori/go.uuid"
	"testing"
)

func TestElasticSearchBackend_FilterMessages(t *testing.T) {
	conf := ElasticSearchConfig{
		Urls: []string{"http://es.dev.caliopen.org:9200"},
	}
	es, err := InitializeElasticSearchIndex(conf)
	if err != nil {
		t.Error(err)
	}
	var user_id objects.UUID
	id, _ := uuid.FromString("8a8fdb3d-cd41-4988-a0a5-80ea2df2633e")
	user_id.UnmarshalBinary(id.Bytes())
	filter := objects.MessagesListFilter{
		User_id: user_id,
		Terms:   map[string]string{"discussion_id": "06e35fed-72d5-4138-b5d3-cc2e28a1bf6d"},
	}
	result, err := es.FilterMessages(filter)
	if err != nil {
		t.Error(err)
	}

	t.Logf("%+v", result[0])
}
