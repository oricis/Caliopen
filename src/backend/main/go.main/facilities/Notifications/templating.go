package Notifications

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"gopkg.in/flosch/pongo2.v3"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

// RenderResetEmail will load the yaml/j2 template from template_path
// and scaffold a Message with data provided in context map
func RenderEmail(template_path string, context map[string]interface{}) (*Message, error) {

	// load email attributes from template file
	var email map[string]interface{}

	file, err := ioutil.ReadFile(template_path)
	if err != nil {
		return nil, err
	}
	err = yaml.Unmarshal(file, &email)
	if err != nil {
		return nil, err
	}

	var bodyHtml, bodyPlain, subject string

	if s, found := email["subject"]; found {
		if s_, ok := s.(string); ok && s_ != "" {
			tpl, err := pongo2.FromString(s_)
			if err == nil {
				subject, _ = tpl.Execute(pongo2.Context(context))
			}
		}
	}

	if plain, found := email["body_plain"]; found {
		if p, ok := plain.(string); ok && p != "" {
			tpl, err := pongo2.FromString(p)
			if err == nil {
				bodyPlain, err = tpl.Execute(pongo2.Context(context))
			}
		}
	}

	if html, found := email["body_html"]; found {
		if h, ok := html.(string); ok && h != "" {
			tpl, err := pongo2.FromString(h)
			if err == nil {
				bodyHtml, err = tpl.Execute(pongo2.Context(context))
			}
		}
	}

	// create Message with strings
	return &Message{
		Subject:    subject,
		Body_html:  bodyHtml,
		Body_plain: bodyPlain,
	}, nil
}
