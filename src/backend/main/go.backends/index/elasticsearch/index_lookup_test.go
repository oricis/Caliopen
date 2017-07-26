package index

import "testing"

func TestElasticSearchBackend_RecipientsSuggest(t *testing.T) {

	es, err := InitializeElasticSearchIndex(ElasticSearchConfig{
		Urls: []string{"http://es.dev.caliopen.org:9200"}},
	)
	if err != nil {
		t.Error(err)
	}
	user_id := "8430b7e1-018e-482e-a06b-eb5e01a9ebcf"
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
		if len(results) == 0 {
			t.Logf("%T", results)
		}
		for _, result := range results {
			t.Logf("%+v", result)
		}
	}
}
