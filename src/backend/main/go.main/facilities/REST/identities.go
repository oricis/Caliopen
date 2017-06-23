// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (rest *RESTfacility) LocalsIdentities(user_id string) ([]LocalIdentity, error) {
	return rest.store.GetLocalsIdentities(user_id)
}

// Make use of index facility to return to user a list of suggested recipients
// within the context of composing a new message
// list is ordered by relevance : first suggestion should be the best
func (rest *RESTfacility) SuggestRecipients(user_id, query_string string) (suggests []RecipientSuggestion, err error) {
	suggestion := RecipientSuggestion{
		Address:  "dave@idoi.re",
		Label:    "La belle rouge",
		Protocol: "email",
		Source:   "participant",
	}
	suggests = []RecipientSuggestion{suggestion}

	return
}
