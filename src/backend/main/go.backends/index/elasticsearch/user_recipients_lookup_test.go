package index

import (
	"strings"
	"testing"
)

func TestRecipientsSuggest(t *testing.T) {

	es, err := InitializeElasticSearchIndex(ElasticSearchConfig{
		Urls: []string{"http://es.dev.caliopen.org:9200"}},
	)
	if err != nil {
		t.Error(err)
	}
	user_id := "7d67bb5e-6683-4528-9a5c-bb292210a0ef"
	query_strings := []string{
		"ali",
		"ali@",
		"alix",
		"Alix",
		"ALIX",
		"älix",
		"cedric",
		"cédric",
		"ced",
		"céd",
		"cdé",
		"achard",
		"mail",
		"mailo",
		"laurent",
		"Achàrd",
		"guy",
		"Güy",
		"dev",
		"valérie",
		"valerie",
		"Valérie@alpha",
		"val",
		"nisl",
		"pépé",
		"idoire",
		"id",
		"oire",
		"local",
		"caliopen",
		"caliopen.local",
	}
	for _, query_string := range query_strings {
		results, err := es.RecipientsSuggest(user_id, strings.ToLower(query_string))
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
