package index

import "testing"

func TestElasticSearchBackend_RecipientsSuggest(t *testing.T) {

	es, err := InitializeElasticSearchIndex(ElasticSearchConfig{
		Urls: []string{"http://es.dev.caliopen.org:9200"}},
	)
	if err != nil {
		t.Error(err)
	}
	user_id := "f34528ca-b172-4df3-b27f-32cb18e1ad1f"
	query_strings := []string{
		"clem",
		"laurent",
		"clement.pit@gmail.com",
		"chemla",
		"thom",
		"toto",
		"dev",
		"caliopen",
		"@caliopen",
		"gandi.net",
	}
	for _, query_string := range query_strings {
		results, err := es.RecipientsSuggest(user_id, query_string)
		if err != nil {
			t.Error(err)
		}
		t.Logf("##### Result for string <%s> : ", query_string)
		for _, result := range results {
			t.Logf("%+v", result)
		}
	}
}
