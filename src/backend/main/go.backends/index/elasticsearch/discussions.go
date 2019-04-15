// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package index

import (
	"context"
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/messages"
	"github.com/satori/go.uuid"
	"gopkg.in/olivere/elastic.v5"
)

func (es *ElasticSearchBackend) GetDiscussionsList(filter IndexSearch) (discussions []Discussion, err error) {
	discussions = []Discussion{}

	search := es.Client.Search().Index(filter.Shard_id).Type(MessageIndexType)
	search = filter.FilterQuery(search, true)
	msgSource := elastic.NewFetchSourceContext(true)
	msgSource.Include("date_sort", "subject", "participants", "body_plain", "body_html")
	search.Aggregation("by_uris", elastic.NewTermsAggregation().Field("discussion_id").Size(10000). // need to fetch lot of buckets to have an accurate buckets count
													SubAggregation("sub_bucket", elastic.NewTopHitsAggregation().Sort("date_sort", false).Size(1).FetchSourceContext(msgSource)).
													SubAggregation("unread_count", elastic.NewFilterAggregation().Filter(elastic.NewTermQuery("is_unread", true))))
	// TODO : attachment count aggr + min importance level agg

	var result *elastic.SearchResult
	result, err = search.Do(context.TODO())

	if err != nil {
		return nil, err
	}
	agg := result.Aggregations["by_uris"]

	var byUris Aggregation
	json.Unmarshal([]byte(*agg), &byUris)

	if len(byUris.Buckets) == 0 {
		return
	}

	/*
		byUris' Bucket.SubBucket :
			map[hits:
				map[hits:
				 [map[
					_id:xxxx
					_index:xxxx
					_score:<nil>
					_source:map[date_sort:xx participants:[xxxx] subject:xxx]
	*/

	// build discussions' array from raw bytes result
	for _, hit := range byUris.Buckets {
		msg := &Message{}
		var subBucket map[string]interface{}
		json.Unmarshal(hit.SubBucket, &subBucket)
		var subHit = subBucket["hits"].(map[string]interface{})["hits"].([]interface{})[0].(map[string]interface{})

		msg.UnmarshalMap(subHit["_source"].(map[string]interface{}))

		discussions = append(discussions, Discussion{
			DateUpdate:         msg.Date_sort,
			DiscussionId:       hit.Key,
			Excerpt:            messages.ExcerptMessage(*msg, 200, true, true),
			LastMessageDate:    msg.Date_sort,
			LastMessageId:      UUID(uuid.FromStringOrNil(subHit["_id"].(string))),
			LastMessageSubject: msg.Subject,
			Participants:       msg.Participants,
			Subject:            msg.Subject,
			TotalCount:         int32(hit.DocCount),
			UnreadCount:        int32(hit.UnreadCount.DocCount),
			UserId:             filter.User_id,
		})
	}

	return discussions, err
}
