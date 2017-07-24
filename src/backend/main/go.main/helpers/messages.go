// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/microcosm-cc/bluemonday"
)

// scrub message's bodies to make message displayable in frontend interfaces.
// message is modified in-place.
// if sanitation failed, message's string bodies are emptied
func SanitizeMessageBodies(msg *objects.Message) {
	p := CaliopenPolicy()
	msg.Body_plain = p.Sanitize(msg.Body_plain)
	msg.Body_html = p.Sanitize(msg.Body_html)
}

// UGCPolicy returns a policy aimed at user generated content that is a result
// of HTML WYSIWYG tools and Markdown conversions.
//
// This is expected to be a fairly rich document where as much markup as
// possible should be retained. Markdown permits raw HTML so we are basically
// providing a policy to sanitise HTML5 documents safely but with the
// least intrusion on the formatting expectations of the user.
//
//See https://github.com/microcosm-cc/bluemonday to build a bespoke policy.
func CaliopenPolicy() *bluemonday.Policy {
	return bluemonday.UGCPolicy()
}
