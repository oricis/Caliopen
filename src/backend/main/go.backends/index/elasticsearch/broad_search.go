package index

import (
	"context"
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/satori/go.uuid"
	"gopkg.in/olivere/elastic.v5"
)

// Composes a full text ES query from IndexSearch object,
// making use of "common terms query" (see https://www.elastic.co/guide/en/elasticsearch/reference/5.4/query-dsl-common-terms-query.html).
// The func returns a compound response from ES to return 5 relevant docs filed by type if no doctype is provided,
// otherwise, all docs found within type are returned.
// See search API readme file into doc folder to see how the search func could be used by frontend.
func (es *ElasticSearchBackend) Search(search IndexSearch) (result *IndexResult, err error) {
	const (
		sub_agg_key = "top_score_hits"
		agg_key     = "by_type"
	)
	q := elastic.NewBoolQuery()

	// Strictly filter on user_id
	q = q.Filter(elastic.NewTermQuery("user_id", search.User_id))

	cutoffFrequency := 0.05 //words that have a document frequency greater than xx% will be treated as common terms.
	for field, value := range search.Terms {
		q = q.Should(elastic.NewCommonTermsQuery(field, value).CutoffFrequency(cutoffFrequency))
		// always add the common fields below to improve results
		q = q.Should(elastic.NewCommonTermsQuery("body_plain", value).CutoffFrequency(cutoffFrequency))
		q = q.Should(elastic.NewCommonTermsQuery("body_plain.normalized", value).CutoffFrequency(cutoffFrequency))
		q = q.Should(elastic.NewCommonTermsQuery("body_html", value).CutoffFrequency(cutoffFrequency))
		q = q.Should(elastic.NewCommonTermsQuery("body_html.normalized", value).CutoffFrequency(cutoffFrequency))
		q = q.Should(elastic.NewCommonTermsQuery("subject", value).CutoffFrequency(cutoffFrequency)).Boost(2)
		q = q.Should(elastic.NewCommonTermsQuery("subject.normalized", value).CutoffFrequency(cutoffFrequency)).Boost(2)
		q = q.Should(elastic.NewCommonTermsQuery("given_name", value).CutoffFrequency(cutoffFrequency)).Boost(3)
		q = q.Should(elastic.NewCommonTermsQuery("given_name.normalized", value).CutoffFrequency(cutoffFrequency)).Boost(3)
		q = q.Should(elastic.NewCommonTermsQuery("family_name", value).CutoffFrequency(cutoffFrequency)).Boost(3)
		q = q.Should(elastic.NewCommonTermsQuery("family_name.normalized", value).CutoffFrequency(cutoffFrequency)).Boost(3)
		q = q.Should(elastic.NewCommonTermsQuery("title.raw", value).CutoffFrequency(cutoffFrequency)).Boost(5)
		q = q.Should(elastic.NewCommonTermsQuery("participants.address.raw", value).CutoffFrequency(cutoffFrequency)).Boost(2)
		q = q.Should(elastic.NewCommonTermsQuery("participants.label", value).CutoffFrequency(cutoffFrequency)).Boost(2)
		q = q.Should(elastic.NewCommonTermsQuery("emails.address.raw", value).CutoffFrequency(cutoffFrequency)).Boost(2)
	}

	// make aggregation to file docs by type:
	// get only the 5 most relevant doc for each type if search.DocType is empty
	// otherwise get docs according to limit & offset params.
	var s *elastic.SearchService
	switch search.DocType {
	case "":
		// no doctype provided. Trigger search on all document types within index and build an aggregation
		/*highlight disabled*/                                                //h := elastic.NewHighlight().Fields(elastic.NewHighlighterField("*").RequireFieldMatch(false))
		top_hits := elastic.NewTopHitsAggregation().Size(5).FetchSource(true) //.Highlight(h)
		by_type := elastic.NewTermsAggregation().Field("_type").SubAggregation(sub_agg_key, top_hits)
		//TODO/WIP
		/*iq := elastic.NewIndicesQuery(elastic.NewRangeQuery("importance_level").Gte(search.ILrange[0]).Lte(search.ILrange[1]), MessageIndexType)
		msg_hits := elastic.NewFilterAggregation().Filter(iq)
		*/
		s = es.Client.Search().Index(search.Shard_id).Query(q).FetchSource(false).Aggregation(agg_key, by_type) //.Highlight(h)
	case MessageIndexType:
		// The search focuses on message document type, no aggregation needed, but importance level apply
		/*highlight disabled*/ //h := elastic.NewHighlight().Fields(elastic.NewHighlighterField("*").RequireFieldMatch(false))
		rq := elastic.NewRangeQuery("importance_level").Gte(search.ILrange[0]).Lte(search.ILrange[1])
		s = es.Client.Search().Index(search.Shard_id).Query(q).FetchSource(true). /*.Highlight(h)*/ PostFilter(rq)
	case ContactIndexType:
		// The search focuses on contact document type, no aggregation needed and importance level not taken into account
		/*highlight disabled*/                                                   //h := elastic.NewHighlight().Fields(elastic.NewHighlighterField("*").RequireFieldMatch(false))
		s = es.Client.Search().Index(search.Shard_id).Query(q).FetchSource(true) //.Highlight(h)
	}

	//prepare search
	// add type, from & size params only if type is not empty
	if search.DocType != "" {
		s = s.Type(search.DocType)
		if search.Offset > 0 {
			s = s.From(search.Offset)
		}
		if search.Limit > 0 {
			s = s.Size(search.Limit)
		}
	}
	/** log the full json query to help development
	source, _ := q.Source()
	json_query, _ := json.Marshal(source)
	log.Infof("\nES query source: %s\n", json_query)

	/** end of log **/
	// execute the search
	s.MinScore(0.1)
	response, err := s.Do(context.TODO())
	if err != nil {
		return nil, err
	}
	// build IndexResult from ES response
	result = &IndexResult{
		Total:        response.TotalHits(),
		MessagesHits: MessageHits{0, []*IndexHit{}},
		ContactsHits: ContactHits{0, []*IndexHit{}},
	}
	if search.DocType != "" {
		// no aggregation, thus elastic returns a parsed json
		switch search.DocType {
		case MessageIndexType:
			result.MessagesHits.Total = response.TotalHits()
			for _, hit := range response.Hits.Hits {
				msg := new(Message)
				if err := json.Unmarshal(*hit.Source, msg); err != nil {
					log.Info(err)
					continue
				}
				msg_id, _ := uuid.FromString(hit.Id)
				msg.Message_id.UnmarshalBinary(msg_id.Bytes())

				msg_hit := new(IndexHit)
				msg_hit.Id = msg.Message_id
				msg_hit.Score = *hit.Score
				msg_hit.Highlights = hit.Highlight
				msg_hit.Document = msg
				(*result).MessagesHits.Messages = append((*result).MessagesHits.Messages, msg_hit)
			}
		case ContactIndexType:
			result.ContactsHits.Total = response.TotalHits()
			for _, hit := range response.Hits.Hits {
				contact := new(Contact)
				if err := json.Unmarshal(*hit.Source, contact); err != nil {
					log.Info(err)
					continue
				}
				contact_id, _ := uuid.FromString(hit.Id)
				contact.ContactId.UnmarshalBinary(contact_id.Bytes())

				contact_hit := new(IndexHit)
				contact_hit.Id = contact.ContactId
				contact_hit.Score = *hit.Score
				contact_hit.Highlights = hit.Highlight
				contact_hit.Document = contact
				(*result).ContactsHits.Contacts = append((*result).ContactsHits.Contacts, contact_hit)
			}
		}

	} else {
		// elastic returns buckets aggregation as a raw []byte, need to unmarshal
		by_types, _ := response.Aggregations[agg_key] // by_types is a *json.RawMessage
		var agg map[string]interface{}
		err = json.Unmarshal(*by_types, &agg)
		if err != nil {
			return nil, err
		}
		buckets := agg["buckets"].([]interface{})
		for _, b := range buckets {
			bucket := b.(map[string]interface{})
			total, _ := bucket["doc_count"].(float64)
			switch bucket["key"].(string) {
			case MessageIndexType:
				(*result).MessagesHits.Total = int64(total)
			case ContactIndexType:
				(*result).ContactsHits.Total = int64(total)
			}

			//go deeper within map to get documents and unmarshal them to our objects
			top_score_hits, _ := bucket[sub_agg_key].(map[string]interface{})
			hits, _ := top_score_hits["hits"].(map[string]interface{})
			hits_hits, _ := hits["hits"].([]interface{})

			for _, hh := range hits_hits {
				hit := hh.(map[string]interface{})
				h := new(IndexHit)
				id, _ := hit["_id"].(string)
				uid, _ := uuid.FromString(id)
				h.Id.UnmarshalBinary(uid.Bytes())
				h.Score, _ = hit["_score"].(float64)
				highlights, _ := hit["highlight"].(map[string]interface{})
				h.Highlights = map[string][]string{}
				for key, value := range highlights {
					for _, highlight := range value.([]interface{}) {
						h.Highlights[key] = append(h.Highlights[key], highlight.(string))
					}
				}
				switch bucket["key"].(string) {
				case MessageIndexType:
					msg_map, _ := hit["_source"].(map[string]interface{})
					msg := new(Message)
					if err := msg.UnmarshalMap(msg_map); err == nil {
						msg.User_id = search.User_id
						msg.Message_id = h.Id
						h.Document = msg
						(*result).MessagesHits.Messages = append(result.MessagesHits.Messages, h)
					}
				case ContactIndexType:
					contact_map, _ := hit["_source"].(map[string]interface{})
					contact := new(Contact)
					if err := contact.UnmarshalMap(contact_map); err == nil {
						contact.UserId = search.User_id
						contact.ContactId = h.Id
						h.Document = contact
						(*result).ContactsHits.Contacts = append(result.ContactsHits.Contacts, h)
					}
				}
			}
		}
	}

	return
}
