package REST

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	index "github.com/CaliOpen/Caliopen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/satori/go.uuid"
	"testing"
)

func TestSearch(t *testing.T) {
	es, err := index.InitializeElasticSearchIndex(index.ElasticSearchConfig{
		Urls: []string{"http://es.dev.caliopen.org:9200"}},
	)
	if err != nil {
		t.Error(err)
	}
	user_id, _ := uuid.FromString("5032ba23-f172-45d7-a600-7cb4089bd458")
	search_params := objects.IndexSearch{}
	search_params.User_id.UnmarshalBinary(user_id.Bytes())
	index_result, err := es.Search(search_params)
	if err != nil {
		t.Error(err)
	}
	for _, hit := range index_result.Hits {
		t.Logf("response : %+v\n", hit.Document)
	}

	/*
		var resp map[string]interface{}
		json.Unmarshal(ESresponse, &resp)

		t.Logf("unmarshal : %+v\n", resp["hits"].(map[string]interface{})["hits"])
	*/
}
