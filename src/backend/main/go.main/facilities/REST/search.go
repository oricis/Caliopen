package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// API to execute broad-based searches within index
// Searches are executed on all user's indexes
func (rest *RESTfacility) Search(search IndexSearch) (result []byte, err error) {

	_, err = rest.index.Search(search)
	if err != nil {
		return result, err
	}

	return result, err
}
