// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"gopkg.in/oleiade/reflections.v1"
	"sort"
	"strings"
	"time"
)

type PIMessage struct {
	Transport uint32 `json:"transport"`
	Social    uint32 `json:"social"`
	Content   uint32 `json:"content"`
}

type Message struct {
	Attachments         []Attachment       `cql:"attachments"              json:"attachments,omitempty"       `
	Body_html           string             `cql:"body_html"                json:"body_html"         `
	Body_plain          string             `cql:"body_plain"               json:"body_plain"        `
	Body_excerpt        string             `cql:"-"                        json:"excerpt"           `
	Date                time.Time          `cql:"date"                     json:"date"                                                      formatter:"RFC3339Milli"`
	Date_delete         time.Time          `cql:"date_delete"              json:"date_delete,omitempty"                                     formatter:"RFC3339Milli"`
	Date_insert         time.Time          `cql:"date_insert"              json:"date_insert"                                               formatter:"RFC3339Milli"`
	Date_sort           time.Time          `cql:"date_sort"                json:"date_sort"                                                 formatter:"RFC3339Milli"`
	Discussion_id       string             `cql:"discussion_id"            json:"discussion_id,omitempty"                                   formatter:"rfc4122"`
	External_references ExternalReferences `cql:"external_references"      json:"external_references,omitempty"`
	UserIdentities      []UUID             `cql:"user_identities"          json:"user_identities,omitempty"       `
	Importance_level    int32              `cql:"importance_level"         json:"importance_level" `
	Is_answered         bool               `cql:"is_answered"              json:"is_answered"      `
	Is_draft            bool               `cql:"is_draft"                 json:"is_draft"         `
	Is_unread           bool               `cql:"is_unread"                json:"is_unread"        `
	Is_received         bool               `cql:"is_received"              json:"is_received"      `
	Message_id          UUID               `cql:"message_id"               json:"message_id,omitempty"                                      formatter:"rfc4122"`
	Parent_id           UUID               `cql:"parent_id"                json:"parent_id,omitempty"        `
	Participants        []Participant      `cql:"participants"             json:"participants"     `
	PI                  *PIMessage         `cql:"-"                        json:"pi_message,omitempty"`
	Privacy_features    *PrivacyFeatures   `cql:"privacy_features"         json:"privacy_features,omitempty" `
	PrivacyIndex        *PrivacyIndex      `cql:"pi"                       json:"pi,omitempty"`
	Raw_msg_id          UUID               `cql:"raw_msg_id"               json:"raw_msg_id,omitempty"                                      formatter:"rfc4122"`
	Subject             string             `cql:"subject"                  json:"subject"          `
	Tags                []string           `cql:"tagnames"                 json:"tags,omitempty"                     patch:"system" `
	Protocol            string             `cql:"protocol"                 json:"protocol,omitempty"             `
	User_id             UUID               `cql:"user_id"                  json:"user_id,omitempty"                  formatter:"rfc4122"`
}

type Messages []*Message

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaler takes account of custom tags for given 'context'
func (msg *Message) JSONMarshaller(context string, body_type ...string) ([]byte, error) {
	var jsonBuf bytes.Buffer
	enc := json.NewEncoder(&jsonBuf)

	fields, err := reflections.Fields(*msg)
	if err != nil {
		return jsonBuf.Bytes(), err
	}
	jsonBuf.WriteByte('{')
	first := new(bool)
	*first = true
	body_not_merged := true
fieldsLoop:
	for _, field := range fields {
		switch context {
		case "elastic":
			j_elastic, err := reflections.GetFieldTag(msg, field, "elastic")
			if err == nil {
				switch j_elastic {
				case "omit":
					continue fieldsLoop
				}
			}
		case "frontend":
			front, err := reflections.GetFieldTag(msg, field, "frontend")
			if err == nil {
				switch front {
				case "omit":
					continue fieldsLoop
				}
				//output only one body for frontend clients
				if field == "Body_html" || field == "Body_plain" {
					if body_not_merged {
						if *first {
							*first = false
						} else {
							jsonBuf.WriteByte(',')
						}
						jsonBuf.WriteString("\"body\":")
						// TODO : put html or plain in exported body regarding current user preferences
						var body_is_plain bool
						if len(body_type) > 0 && len(msg.Body_html) > 0 && len(msg.Body_plain) > 0 {
							if body_type[0] == "rich_text" {
								enc.Encode(msg.Body_html)
								body_is_plain = false
							} else {
								enc.Encode(msg.Body_plain)
								body_is_plain = true
							}
						} else {
							if msg.Body_html != "" {
								enc.Encode(msg.Body_html)
								body_is_plain = false
							} else {
								enc.Encode(msg.Body_plain)
								body_is_plain = true
							}
						}
						if body_is_plain {
							jsonBuf.WriteString(",\"body_is_plain\":true")
						} else {
							jsonBuf.WriteString(",\"body_is_plain\":false")
						}
						body_not_merged = false
						continue fieldsLoop
					} else {
						continue fieldsLoop
					}
				}
			}
		}
		marshallField(msg, field, context, &jsonBuf, first, enc)
	}
	jsonBuf.WriteByte('}')
	return jsonBuf.Bytes(), nil
}

func (msg *Message) MarshalJSON() ([]byte, error) {
	return msg.JSONMarshaller("json")
}

func (msg *Message) MarshalES() ([]byte, error) {
	return msg.JSONMarshaller("elastic")
}

// return a JSON representation of Message suitable for frontend client
func (msg *Message) MarshalFrontEnd(body_type string) ([]byte, error) {
	return msg.JSONMarshaller("frontend", body_type)
}

func (msg *Message) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}
	return msg.UnmarshalMap(input)
}

func (msg *Message) UnmarshalMap(input map[string]interface{}) error {
	if attachments, ok := input["attachments"]; ok && attachments != nil {
		msg.Attachments = []Attachment{}
		for _, attachment := range attachments.([]interface{}) {
			A := new(Attachment)
			if err := A.UnmarshalMap(attachment.(map[string]interface{})); err == nil {
				msg.Attachments = append(msg.Attachments, *A)
			}
		}
	}
	if body_html, ok := input["body_html"].(string); ok {
		msg.Body_html = body_html
	}
	if body_plain, ok := input["body_plain"].(string); ok {
		msg.Body_plain = body_plain
	}
	if date, ok := input["date"]; ok && date != nil {
		msg.Date, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["date_delete"]; ok && date != nil {
		msg.Date_delete, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["date_insert"]; ok && date != nil {
		msg.Date_insert, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["date_sort"]; ok && date != nil {
		msg.Date_sort, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if discussion_id, ok := input["discussion_id"].(string); ok {
		msg.Discussion_id = discussion_id
	}

	if ex_ref, ok := input["external_references"]; ok && ex_ref != nil {
		msg.External_references = ExternalReferences{
			Ancestors_ids: []string{},
		}
		msg.External_references.UnmarshalMap(ex_ref.(map[string]interface{}))
	}
	if identities, ok := input["user_identities"]; ok && identities != nil {
		msg.UserIdentities = []UUID{}
		for _, identity := range identities.([]interface{}) {
			uid := UUID{}
			if id, err := uuid.FromString(identity.(string)); err == nil {
				if e := uid.UnmarshalBinary(id.Bytes()); e == nil {
					msg.UserIdentities = append(msg.UserIdentities, uid)
				}
			}
		}
	}
	if importance_level, ok := input["importance_level"].(float64); ok {
		msg.Importance_level = int32(importance_level)
	}
	if is_answered, ok := input["is_answered"].(bool); ok {
		msg.Is_answered = is_answered
	}
	if is_draft, ok := input["is_draft"].(bool); ok {
		msg.Is_draft = is_draft
	}
	if is_unread, ok := input["is_unread"].(bool); ok {
		msg.Is_unread = is_unread
	}
	if is_received, ok := input["is_received"].(bool); ok {
		msg.Is_received = is_received
	}
	if message_id, ok := input["message_id"].(string); ok {
		if id, err := uuid.FromString(message_id); err == nil {
			msg.Message_id.UnmarshalBinary(id.Bytes())
		}
	}

	if parent_id, ok := input["parent_id"].(string); ok {
		if id, err := uuid.FromString(parent_id); err == nil {
			msg.Parent_id.UnmarshalBinary(id.Bytes())
		}
	}

	if participants, ok := input["participants"]; ok && participants != nil {
		msg.Participants = []Participant{}
		for _, participant := range participants.([]interface{}) {
			P := new(Participant)
			if err := P.UnmarshalMap(participant.(map[string]interface{})); err == nil {
				msg.Participants = append(msg.Participants, *P)
			}
		}
	}
	if i_pi, ok := input["pi"]; ok && i_pi != nil {
		pi := new(PrivacyIndex)
		if err := pi.UnmarshalMap(i_pi.(map[string]interface{})); err == nil {
			msg.PrivacyIndex = pi
		}
	}
	if pf, ok := input["privacy_features"]; ok && pf != nil {
		PF := &PrivacyFeatures{}
		PF.UnmarshalMap(pf.(map[string]interface{}))
		msg.Privacy_features = PF
	}
	if raw_msg_id, ok := input["raw_msg_id"].(string); ok {
		if id, err := uuid.FromString(raw_msg_id); err == nil {
			msg.Raw_msg_id.UnmarshalBinary(id.Bytes())
		}
	}
	if subject, ok := input["subject"].(string); ok {
		msg.Subject = subject
	}
	if tags, ok := input["tags"]; ok && tags != nil {
		msg.Tags = []string{}
		for _, tag := range tags.([]interface{}) {
			msg.Tags = append(msg.Tags, tag.(string))
		}
	}
	if p, ok := input["protocol"].(string); ok {
		msg.Protocol = p
	}
	if user_id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(user_id); err == nil {
			msg.User_id.UnmarshalBinary(id.Bytes())
		}
	}

	return nil
}

// unmarshal a map[string]interface{} coming from gocql
func (msg *Message) UnmarshalCQLMap(input map[string]interface{}) error {
	if _, ok := input["attachments"]; ok {
		msg.Attachments = []Attachment{}
		for _, attachment := range input["attachments"].([]map[string]interface{}) {
			a := Attachment{}
			a.ContentType, _ = attachment["content_type"].(string)
			a.FileName, _ = attachment["file_name"].(string)
			a.IsInline, _ = attachment["is_inline"].(bool)
			a.Size, _ = attachment["size"].(int)
			a.URL, _ = attachment["url"].(string)
			a.MimeBoundary, _ = attachment["mime_boundary"].(string)
			if temp_id, ok := attachment["temp_id"].(gocql.UUID); ok {
				a.TempID.UnmarshalBinary(temp_id.Bytes())
			}
			msg.Attachments = append(msg.Attachments, a)
		}
	}
	if body_html, ok := input["body_html"].(string); ok {
		msg.Body_html = body_html
	}
	if body_plain, ok := input["body_plain"].(string); ok {
		msg.Body_plain = body_plain
	}
	if date, ok := input["date"].(time.Time); ok {
		msg.Date = date
	}
	if date_delete, ok := input["date_delete"].(time.Time); ok {
		msg.Date_delete = date_delete
	}
	if date_insert, ok := input["date_insert"].(time.Time); ok {
		msg.Date_insert = date_insert
	}
	if date_sort, ok := input["date_sort"].(time.Time); ok {
		msg.Date_sort = date_sort
	}
	if discussion_id, ok := input["discussion_id"].(string); ok {
		msg.Discussion_id = discussion_id
	}
	msg.External_references = ExternalReferences{
		Ancestors_ids: []string{},
	}
	if ex_ref, ok := input["external_references"].(map[string]interface{}); ok && ex_ref != nil {
		if ids, ok := ex_ref["ancestors_ids"]; ok && len(ids.([]string)) > 0 {
			msg.External_references.Ancestors_ids, _ = ids.([]string)
		} else {
			msg.External_references.Ancestors_ids = []string{}
		}
		msg.External_references.Message_id, _ = ex_ref["message_id"].(string)
		msg.External_references.Parent_id, _ = ex_ref["parent_id"].(string)
	}
	if identities, ok := input["user_identities"]; ok && identities != nil {
		msg.UserIdentities = []UUID{}
		for _, identity := range identities.([]gocql.UUID) {
			var uid UUID
			if err := uid.UnmarshalBinary(identity.Bytes()); err == nil {
				msg.UserIdentities = append(msg.UserIdentities, uid)
			}
		}
	}
	if importance_level, ok := input["importance_level"].(int); ok {
		msg.Importance_level = int32(importance_level)
	}
	if is_answered, ok := input["is_answered"].(bool); ok {
		msg.Is_answered = is_answered
	}
	if is_draft, ok := input["is_draft"].(bool); ok {
		msg.Is_draft = is_draft
	}
	if is_unread, ok := input["is_unread"].(bool); ok {
		msg.Is_unread = is_unread
	}
	if is_received, ok := input["is_received"].(bool); ok {
		msg.Is_received = is_received
	}
	if message_id, ok := input["message_id"].(gocql.UUID); ok {
		msg.Message_id.UnmarshalBinary(message_id.Bytes())
	}

	if parent_id, ok := input["parent_id"].(gocql.UUID); ok {
		msg.Parent_id.UnmarshalBinary(parent_id.Bytes())
	}

	if participants, ok := input["participants"]; ok && participants != nil {
		msg.Participants = []Participant{}
		for _, participant := range participants.([]map[string]interface{}) {
			p := Participant{}
			p.Address, _ = participant["address"].(string)
			p.Label, _ = participant["label"].(string)
			p.Protocol, _ = participant["protocol"].(string)
			p.Type, _ = participant["type"].(string)
			if _, ok := participant["contact_ids"]; ok {
				p.Contact_ids = []UUID{}
				for _, id := range participant["contact_ids"].([]gocql.UUID) {
					var contact_uuid UUID
					contact_uuid.UnmarshalBinary(id.Bytes())
					p.Contact_ids = append(p.Contact_ids, contact_uuid)
				}
			}
			msg.Participants = append(msg.Participants, p)
		}
	}
	pi := PrivacyIndex{}
	if i_pi, ok := input["pi"].(map[string]interface{}); ok && i_pi != nil {
		pi.Comportment, _ = i_pi["comportment"].(int)
		pi.Context, _ = i_pi["context"].(int)
		pi.DateUpdate, _ = i_pi["date_sort"].(time.Time)
		pi.Technic, _ = i_pi["technic"].(int)
		pi.Version, _ = i_pi["version"].(int)
	}
	msg.PrivacyIndex = &pi

	pf := PrivacyFeatures{}
	if i_pf, ok := input["privacy_features"].(map[string]string); ok && i_pf != nil {
		for k, v := range i_pf {
			pf[k] = v
		}
	}
	msg.Privacy_features = &pf

	if raw_msg_id, ok := input["raw_msg_id"].(gocql.UUID); ok {
		msg.Raw_msg_id.UnmarshalBinary(raw_msg_id.Bytes())
	}
	if subject, ok := input["subject"].(string); ok {
		msg.Subject = subject
	}
	if tags, ok := input["tagnames"]; ok && tags != nil {
		msg.Tags = []string{}
		for _, tag := range tags.([]string) {
			msg.Tags = append(msg.Tags, tag)
		}
	}
	if p, ok := input["protocol"].(string); ok {
		msg.Protocol = p
	}
	if user_id, ok := input["user_id"].(gocql.UUID); ok {
		msg.User_id.UnmarshalBinary(user_id.Bytes())
	}

	return nil //TODO: error handling
}

// part of the CaliopenObject interface
// NewEmpty returns a new empty initialized sibling of itself
// part of the CaliopenObject interface
func (msg *Message) NewEmpty() interface{} {
	m := new(Message)
	m.Attachments = []Attachment{}
	m.External_references = ExternalReferences{}
	m.UserIdentities = []UUID{}
	m.Participants = []Participant{}
	m.Privacy_features = &PrivacyFeatures{}
	m.Tags = []string{}
	return m
}

func (msg *Message) MarshallNew(args ...interface{}) {
	if len(msg.Message_id) == 0 || (bytes.Equal(msg.Message_id.Bytes(), EmptyUUID.Bytes())) {
		msg.Message_id.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if len(msg.User_id) == 0 || (bytes.Equal(msg.User_id.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				msg.User_id = args[0].(UUID)
			}
		}
	}

	if msg.Date_insert.IsZero() {
		msg.Date_insert = time.Now()
	}

	if msg.Date_sort.IsZero() {
		msg.Date_sort = time.Now()
	}

	for i := range msg.Attachments {
		msg.Attachments[i].MarshallNew()
	}

	for i := range msg.Participants {
		msg.Participants[i].MarshallNew()
	}

}

// part of ObjectPatchable interface
func (msg *Message) JsonTags() (tags map[string]string) {
	return jsonTags(msg)
}

func (msg *Message) SortSlices() {
	sort.Sort(ByFileName(msg.Attachments))
	sort.Sort(ByUUID(msg.UserIdentities))
	sort.Sort(ByAddress(msg.Participants))
	sort.Strings(msg.Tags)
}

// sort interfaces
type ByDateSortAsc Messages

func (ds ByDateSortAsc) Len() int {
	return len(ds)
}

func (ds ByDateSortAsc) Less(i, j int) bool {
	return ds[i].Date_sort.After(ds[j].Date_sort)
}

func (ds ByDateSortAsc) Swap(i, j int) {
	ds[i], ds[j] = ds[j], ds[i]
}

// EmbedParticipantsDetails update messages slice in place
// with data from Contact table related to participants
func MessagesParticipantsDetails(session *gocql.Session, messages []Message) error {
	if len(messages) > 0 {
		// build a collection of unique participants from the messages list
		uniqueParticipants := map[string]Participant{}
		participants := []Participant{}
		for _, msg := range messages {
			participants = append(participants, msg.Participants...)
		}
		for _, p := range participants {
			uri := strings.ToLower(p.Protocol + ":" + p.Address)
			uniqueParticipants[uri] = p
		}

		// get related data from Contact if exist
		ContactsForParticipants(session, messages[0].User_id.String(), uniqueParticipants)

		// update messages with participants' data
		for i, msg := range messages {
			for j, p := range msg.Participants {
				uri := strings.ToLower(p.Protocol + ":" + p.Address)
				msg.Participants[j].Label = uniqueParticipants[uri].Label
				msg.Participants[j].Contact_ids = uniqueParticipants[uri].Contact_ids
			}
			messages[i] = msg
		}
	}
	return nil
}

func DiscussionsParticipantsDetails(session *gocql.Session, discussions []Discussion) error {
	if len(discussions) > 0 {
		participants := []Participant{}
		uniqueParticipants := map[string]Participant{}
		for _, d := range discussions {
			participants = append(participants, d.Participants...)
		}
		for _, p := range participants {
			uri := strings.ToLower(p.Protocol + ":" + p.Address)
			uniqueParticipants[uri] = p
		}
		ContactsForParticipants(session, discussions[0].UserId.String(), uniqueParticipants)
		for i, d := range discussions {
			for j, p := range d.Participants {
				uri := strings.ToLower(p.Protocol + ":" + p.Address)
				d.Participants[j] = uniqueParticipants[uri]
			}
			discussions[i] = d
		}
	}
	return nil
}
