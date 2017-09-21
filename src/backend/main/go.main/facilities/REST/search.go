package REST

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
)

// API to execute broad-based searches within index
// Searches are executed in all docs types of user
func (rest *RESTfacility) Search(search IndexSearch) (response *IndexResult, err error) {

	// double check search object consistency before triggering the search
	if search.DocType != "" {
		if search.DocType != MessageIndexType && search.DocType != ContactIndexType {
			return nil, errors.New("[RESTfacility] Invalid doc_type in search request")
		}
	} else {
		if search.Offset > 0 || search.Limit > 0 {
			return nil, errors.New("[RESTfacility] invalid search request: params 'offset', 'limit' are only accepted if param 'doc_type' is also provided")
		}
	}

	// trigger the search
	result, err := rest.index.Search(search)
	if err != nil {
		return nil, err
	}

	// prepare messages objects for frontend rendering
	for _, doc := range result.MessagesHits.Messages {
		msg := doc.Document.(*Message)
		helpers.SanitizeMessageBodies(msg)
		(*msg).Body_excerpt = helpers.ExcerptMessage(*msg, 200, true, true)
	}

	return result, nil
}
