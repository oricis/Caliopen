// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type Attachment struct {
	Content_type string `cql:"content_type"     json:"content_type"`
	File_name    string `cql:"file_name"        json:"file_name"`
	Is_inline    bool   `cql:"is_inline"        json:"is_inline"`
	Size         int    `cql:"size"             json:"size"`
	URL          string `cql:"url"              json:"url"`           // ObjectStore url for temporary file (draft)
	MimeBoundary string `cql:"mime_boundary"    json:"mime_boundary"` // for attachments embedded in raw messages
}

func (a *Attachment) UnmarshalMap(input map[string]interface{}) error {
	if content_type, ok := input["content_type"].(string); ok {
		a.Content_type = content_type
	}
	if file_name, ok := input["file_name"].(string); ok {
		a.File_name = file_name
	}
	if is_inline, ok := input["is_inline"].(bool); ok {
		a.Is_inline = is_inline
	}
	if size, ok := input["size"].(float64); ok {
		a.Size = int(size)
	}
	if url, ok := input["url"].(string); ok {
		a.URL = url
	}
	if mimeBoundary, ok := input["mime_boundary"].(string); ok {
		a.MimeBoundary = mimeBoundary
	}
	return nil //TODO: error handling
}
