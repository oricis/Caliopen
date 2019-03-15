package Notifications

import (
	"encoding/base64"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/flosch/pongo2.v3"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"path"
)

var templateDir string

// RenderResetEmail will load the yaml/j2 template from template_path
// and scaffold a Message with data provided in context map
func RenderEmail(template_path string, context map[string]interface{}) (*Message, error) {
	templateDir = path.Dir(template_path)
	// adds our base64encodeImgSrc encoder in context
	context["base64encodeImgSrc"] = base64encodeImgSrc

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
			} else {
				log.WithError(err).Warnf("[RenderEmail] failed to execute template %s", template_path)
			}
		}
	}

	if plain, found := email["body_plain"]; found {
		if p, ok := plain.(string); ok && p != "" {
			tpl, err := pongo2.FromString(p)
			if err == nil {
				bodyPlain, err = tpl.Execute(pongo2.Context(context))
			} else {
				log.WithError(err).Warnf("[RenderEmail] failed to execute template %s", template_path)
			}
		}
	}

	if html, found := email["body_html"]; found {
		if h, ok := html.(string); ok && h != "" {
			tpl, err := pongo2.FromString(h)
			if err == nil {
				bodyHtml, err = tpl.Execute(pongo2.Context(context))
			} else {
				log.WithError(err).Warnf("[RenderEmail] failed to execute template %s", template_path)
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

// base64encodeImgSrc takes a path to a file and returns src string to inline image in base64
// it implements pongo2 filter interface
func base64encodeImgSrc(in *pongo2.Value) *pongo2.Value {
	imgPath := templateDir + "/" + in.String()
	if len(imgPath) < 6 {
		return pongo2.AsValue("")
	}
	imgExt := path.Ext(imgPath)[1:]
	img, err := ioutil.ReadFile(imgPath)
	if err != nil {
		return pongo2.AsValue(err.Error())
	}
	base64Img := base64.StdEncoding.EncodeToString(img)
	return pongo2.AsValue(`data:image/` + imgExt + `;base64,` + base64Img)
}
