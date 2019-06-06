// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	"errors"

	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// SuggestRecipients makes use of index facility to return to user a list of suggested recipients
// within the context of composing a new message
// list is ordered by relevance : first suggestion should be the best
func (rest *RESTfacility) SuggestRecipients(user *UserInfo, query_string string) (suggests []RecipientSuggestion, err error) {
	if user != nil && query_string != "" && len(query_string) > 2 {
		// TODO : more consistency checking against user_id & query_string
		return rest.index.RecipientsSuggest(user, query_string)
	} else {
		err = errors.New("[RESTfacility.SuggestRecipients] unprocessable parameters")
		return
	}
}
