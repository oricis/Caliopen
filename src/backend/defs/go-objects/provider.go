package objects

import "github.com/emersion/go-imap"

type Provider struct {
	Infos            map[string]string `json:"-"                                mapstructure:"infos"                frontend:"omit"`
	Name             string            `json:"name"                             mapstructure:"name"`
	OauthCallbackUri string            `json:"oauth_callback_uri,omitempty"     mapstructure:"oauth_callback_uri"`
	OauthRequestUrl  string            `json:"oauth_request_url,omitempty"      mapstructure:"oauth_request_url"`
	Protocol         string            `json:"protocol"                         mapstructure:"protocol"`
	Capabilities     map[string]bool   `json:"omitempty"` // capabilities sent back by provider at connection time
	FetchItems       []imap.FetchItem  `json:"omitempty"` // provider specific items that we want to fetch
}

type OauthSession struct {
	RequestSecret string
	RequestToken  string
	UserId        string
}

// return a JSON representation of Provider suitable for frontend client
// for now, Infos is not returned. If client need it in future, we shall cleanup Infos for sensitive data.
func (p *Provider) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", p)
}
