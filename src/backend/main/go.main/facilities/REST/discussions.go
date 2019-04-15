// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/satori/go.uuid"
	"sort"
)

func (rest *RESTfacility) GetDiscussionsList(user *UserInfo, ILrange, PIrange [2]int8, limit, offset int) ([]Discussion, int, error) {
	// Get bucket aggregation of messages by discussion_id, ie by uris_hash
	filter := IndexSearch{
		Offset:   offset,
		Shard_id: user.Shard_id,
		User_id:  UUID(uuid.FromStringOrNil(user.User_id)),
		ILrange:  ILrange,
		PIrange:  PIrange,
	}
	if limit < 1 {
		limit = 20
	}
	filter.Limit = limit

	URIsDiscussions, err := rest.index.GetDiscussionsList(filter)
	if err != nil {
		return []Discussion{}, 0, err
	}

	// Get current participants hashes
	lookups, err := rest.store.GetUserLookupHashes(UUID(uuid.FromStringOrNil(user.User_id)), "uris")
	if err != nil {
		return []Discussion{}, 0, err
	}
	// build a map to resolve uris_hash to participants_hash
	lookupMap := map[string]string{} // => [uris_hash]participants_hash
	for _, lookup := range lookups {
		lookupMap[lookup.Key] = lookup.Value
	}
	// aggregate discussions by participants
	participantsMap := map[string][]Discussion{} // => [participants_hash][]Discussion
	for _, discussion := range URIsDiscussions {
		participants_hash := lookupMap[discussion.DiscussionId]
		if _, ok := participantsMap[participants_hash]; !ok {
			participantsMap[participants_hash] = []Discussion{}
		}
		participantsMap[participants_hash] = append(participantsMap[participants_hash], discussion)
	}

	// get last message for each discussion
	discussionsList := []Discussion{}
	var discussionsCount int
	for _, discussions := range participantsMap {
		earlier := new(Discussion)
		var msgCount int32
		var unreadCount int32
		for _, disc := range discussions {
			if disc.LastMessageDate.After(earlier.LastMessageDate) {
				earlier = &disc
			}
			msgCount += disc.TotalCount
			unreadCount += disc.UnreadCount
		}
		earlier.TotalCount = msgCount
		earlier.UnreadCount = unreadCount
		discussionsList = append(discussionsList, *earlier)
	}
	discussionsCount = len(discussionsList)

	// sort discussions by date_sort
	sort.Sort(ByLastMessageDateDesc(discussionsList))

	// apply offset and limit
	if len(discussionsList) == 0 {
		return discussionsList, discussionsCount, err
	}
	if offset > len(discussionsList) {
		return nil, 0, errors.New("offset is greater than result set")
	}

	if offset+limit > len(discussionsList) {
		return discussionsList[offset:], discussionsCount, nil
	} else {
		return discussionsList[offset : offset+limit], discussionsCount, nil
	}
}
