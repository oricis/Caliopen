// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"encoding/json"
	"github.com/satori/go.uuid"
)

type Attachment struct {
	ContentType  string `cql:"content_type"     json:"content_type,omitempty"`
	FileName     string `cql:"file_name"        json:"file_name,omitempty"`
	IsInline     bool   `cql:"is_inline"        json:"is_inline,omitempty"`
	Size         int    `cql:"size"             json:"size,omitempty"`
	TempID       UUID   `cql:"temp_id"          json:"temp_id,omitempty"`
	URL          string `cql:"url"              json:"url,omitempty"`           // ObjectStore url for temporary file (draft)
	MimeBoundary string `cql:"mime_boundary"    json:"mime_boundary,omitempty"` // for attachments embedded in raw messages
}

func (a *Attachment) UnmarshalMap(input map[string]interface{}) error {
	if content_type, ok := input["content_type"].(string); ok {
		a.ContentType = content_type
	}
	if file_name, ok := input["file_name"].(string); ok {
		a.FileName = file_name
	}
	if is_inline, ok := input["is_inline"].(bool); ok {
		a.IsInline = is_inline
	}
	if size, ok := input["size"].(float64); ok {
		a.Size = int(size)
	}
	if tmpid, ok := input["temp_id"].(string); ok {
		if id, err := uuid.FromString(tmpid); err == nil {
			a.TempID.UnmarshalBinary(id.Bytes())
		}
	}
	if url, ok := input["url"].(string); ok {
		a.URL = url
	}
	if mimeBoundary, ok := input["mime_boundary"].(string); ok {
		a.MimeBoundary = mimeBoundary
	}
	return nil //TODO: error handling
}

func (a *Attachment) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", a)
}

// return a JSON representation of Device suitable for frontend client
func (a *Attachment) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", a)
}

// part of CaliopenObject interface
func (a *Attachment) MarshallNew(...interface{}) {
	if len(a.TempID) == 0 || (bytes.Equal(a.TempID.Bytes(), EmptyUUID.Bytes())) {
		a.TempID.UnmarshalBinary(uuid.NewV4().Bytes())
	}
}

func (a *Attachment) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return a.UnmarshalMap(input)
}

func (a *Attachment) NewEmpty() interface{} {
	return new(Attachment)
}

func (a *Attachment) JsonTags() map[string]string {
	return jsonTags(a)
}

func (a *Attachment) SortSlices() {
	//nothing to sort
}

// Sort interface implementation
type ByFileName []Attachment

func (a ByFileName) Len() int {
	return len(a)
}

func (a ByFileName) Less(i, j int) bool {
	return a[i].FileName < a[j].FileName
}

func (a ByFileName) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
