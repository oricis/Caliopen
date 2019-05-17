// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package messages

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/microcosm-cc/bluemonday"
	"golang.org/x/net/html"
	"regexp"
	"strings"
	"unicode"
	"unicode/utf8"
)

// scrub message's bodies to make message displayable in frontend interfaces.
// message is modified in-place.
// if sanitation failed, message's string bodies are emptied
func SanitizeMessageBodies(msg *Message) {
	p := CaliopenPolicy()
	(*msg).Body_html = p.Sanitize(msg.Body_html)
	(*msg).Body_html = replaceBodyTag(msg.Body_html)
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
	basePolicy := bluemonday.UGCPolicy()
	basePolicy.AllowAttrs("title").Matching(regexp.MustCompile(`[\p{L}\p{N}\s\-_',:\[\]!\./\\\(\)&]*`)).Globally()
	basePolicy.RequireNoFollowOnFullyQualifiedLinks(true)
	basePolicy.AddTargetBlankToFullyQualifiedLinks(true)
	// allow body with few attributes
	basePolicy.AllowElements("body")
	basePolicy.AllowAttrs("leftmargin").Matching(bluemonday.Integer).OnElements("body")
	basePolicy.AllowAttrs("rightmargin").Matching(bluemonday.Integer).OnElements("body")
	basePolicy.AllowAttrs("topmargin").Matching(bluemonday.Integer).OnElements("body")
	basePolicy.AllowAttrs("bottommargin").Matching(bluemonday.Integer).OnElements("body")
	basePolicy.AllowAttrs("marginwidth").Matching(bluemonday.Integer).OnElements("body")
	basePolicy.AllowAttrs("marginheight").Matching(bluemonday.Integer).OnElements("body")
	basePolicy.AllowAttrs("offset").Matching(bluemonday.Integer).OnElements("body")
	// allow img src="data:…
	basePolicy.AllowDataURIImages()

	return basePolicy
}

// Returns an excerpt of Message from either body_plain, body_html or subject.
// Excerpt is always a plain text without any markup, of a length of 'length' runes max.
// Best effort is made to retrieve relevant excerpt from html body (see excerptFromHMTL func)
// A string is always returned, even if excerpt extraction failed.
// If option "wordWrap" is true, string is trimmed at the end of a word, thus it may be shorter than length.
// If option "addEllipsis" is true, … (unicode 2026) is added at the end of the string if the string has been shortened.
func ExcerptMessage(msg Message, length int, wordWrap, addEllipsis bool) (excerpt string) {
	// 1. try to extract excerpt from HTML
	if msg.Body_html != "" {
		var err error
		excerpt, err = excerptFromHMTL(msg.Body_html)
		if err == nil && excerpt != "" {
			return trimExcerpt(excerpt, length, wordWrap, addEllipsis)
		}
	}

	// 2. fall-back to plain body if any
	if msg.Body_plain != "" {
		return trimExcerpt(msg.Body_plain, length, wordWrap, addEllipsis)
	}

	// 3. then subject
	if msg.Subject != "" {
		return trimExcerpt(msg.Subject, length, wordWrap, addEllipsis)
	}

	// 4. nothing found, return empty string
	return ""
}

// algorithm to retrieve the more relevant excerpt from an HMTL doc.
// still WIP in september 2017
func excerptFromHMTL(source string) (excerpt string, err error) {
	p := CaliopenPolicy()
	sanitized := p.Sanitize(source)
	sanitized = replaceBodyTag(sanitized)
	doc, err := html.Parse(strings.NewReader(sanitized))
	if err != nil {
		return "", err
	}
	excerpt_strings := []string{}
	var f func(*html.Node)
	f = func(n *html.Node) {
		//take textNode only, which are not within anchor node
		if n.Type == html.TextNode && n.Data != "" && n.Parent.Data != "a" {
			//remove lines filled with only spaces and/or control chars
			trim_str := strings.TrimFunc(n.Data, func(r rune) bool {
				return unicode.IsControl(r) || unicode.IsSpace(r)
			})
			if len(trim_str) > 0 {
				excerpt_strings = append(excerpt_strings, trim_str)
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}

	f(doc)
	excerpt = strings.Join(excerpt_strings, " ")
	excerpt = html.UnescapeString(excerpt)
	return
}

func trimExcerpt(s string, l int, wordWrap, addEllipsis bool) string {

	trimmed := truncate_unicode(s, l)

	if wordWrap {
		last_valid, width := lastIndexPunctuation(trimmed)
		if last_valid != len(trimmed) && last_valid != -1 { //punctuation found, but not at end of string
			trimmed = trimmed[:last_valid-width]
		}
	}

	if addEllipsis {
		if len(trimmed) < len(s) {
			return trimmed + "…"
		}
	}
	return trimmed

}

func truncate_unicode(s string, l int) string {
	if l == 0 {
		return ""
	}
	runesCount := utf8.RuneCountInString(s)
	if runesCount <= l {
		return s
	}
	runesString := []rune(s)

	return string(runesString[:l])

}

func lastIndexPunctuation(s string) (index, width int) {

	for i, w := len(s), 0; i > 0; i -= w {
		runeValue, width := utf8.DecodeLastRuneInString(s[:i])
		if unicode.IsPunct(runeValue) || unicode.IsSpace(runeValue) {
			return i, width
		}
		w = width
	}
	return -1, 0
}

func replaceBodyTag(in string) (out string) {

	bodyStart := strings.NewReplacer(`<body`, `<div class="caliopen-email"`)
	out = bodyStart.Replace(in)
	bodyEnd := strings.NewReplacer(`/body>`, `/div>`)
	out = bodyEnd.Replace(out)

	return out
}
