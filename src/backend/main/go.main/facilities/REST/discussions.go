// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
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

	URIsDiscussions, err := rest.index.GetDiscussionsList(filter, true)
	if err != nil {
		return []Discussion{}, 0, err
	}

	// Get all current participants hashes for user
	lookups, err := rest.store.GetUserLookupHashes(UUID(uuid.FromStringOrNil(user.User_id)), "uris", "")
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
		discussionsList = append(discussionsList, mergeDiscussionAliases(discussions))
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

// DiscussionMetadata returns one Discussion hydrated with metadata from its messages
// and from messages linked to this discussion_id
func (rest *RESTfacility) DiscussionMetadata(user *UserInfo, discussionId string) (discussion Discussion, err error) {
	userId := UUID(uuid.FromStringOrNil(user.User_id))
	// create a slice of related discussionId
	discussionsIds, err := rest.ExpandDiscussionSet(userId, discussionId)
	if err != nil {
		return
	}
	// retrieve discussions' metadata from index
	discussions, err := rest.index.GetDiscussionsList(IndexSearch{
		Shard_id: user.Shard_id,
		User_id:  userId,
		Terms:    map[string][]string{"discussion_id": discussionsIds},
	}, false)
	if err != nil {
		return
	}
	if len(discussions) == 0 {
		err = errors.New("not found")
		return
	}
	discussion = mergeDiscussionAliases(discussions)
	return
}

// ExpandDiscussionSet returns a slice of discussions ids currently connected to the discussionId in params
func (rest *RESTfacility) ExpandDiscussionSet(userId UUID, discussionId string) (discussionsIds []string, err error) {
	// Get current participants hash for this discussionId
	participants_hash, err := rest.store.GetUserLookupHashes(userId, "uris", discussionId)
	if err != nil {
		return
	}
	if len(participants_hash) > 1 {
		log.Warnf("[DiscussionMetadata] found more than one participants_hash for user %s discussion %s. possible inconsistency", userId.String(), discussionId)
	}
	if len(participants_hash) == 0 {
		err = errors.New("not found")
		return
	}
	// Get all discussion_id related to this participants hash
	related_hashes, err := rest.store.GetUserLookupHashes(userId, "participants", participants_hash[0].Value)
	if err != nil {
		return
	}
	discussionsIds = []string{}
	for _, related := range related_hashes {
		discussionsIds = append(discussionsIds, related.Value)
	}
	return
}

// mergeDiscussionAliases return one Discussion with aggregated metadata from a discussions set
func mergeDiscussionAliases(discussions []Discussion) Discussion {
	earlier := Discussion{}
	var msgCount int32
	var unreadCount int32
	aliases := []string{}
	for _, disc := range discussions {
		aliases = append(aliases, disc.DiscussionId)
		if disc.LastMessageDate.After(earlier.LastMessageDate) {
			earlier = disc
		}
		msgCount += disc.TotalCount
		unreadCount += disc.UnreadCount
	}
	earlier.TotalCount = msgCount
	earlier.UnreadCount = unreadCount
	if len(aliases) > 1 {
		for i, alias := range aliases {
			if alias == earlier.DiscussionId {
				aliases = append(aliases[:i], aliases[i+1:]...)
				break
			}
		}
		earlier.Aliases = aliases
	}
	return earlier
}
