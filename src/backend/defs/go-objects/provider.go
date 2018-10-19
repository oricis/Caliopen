package objects

import "github.com/emersion/go-imap"

type Provider struct {
	Infos            map[string]string `json:"infos"                            mapstructure:"infos"`
	Name             string            `json:"name"                             mapstructure:"name"`
	OauthCallbackUri string            `json:"oauth_callback_uri,omitempty"     mapstructure:"oauth_callback_uri"`
	OauthRequestUrl  string            `json:"oauth_request_url,omitempty"      mapstructure:"oauth_request_url"`
	Protocol         string            `json:"protocol"                         mapstructure:"protocol"`
	Capabilities map[string]bool  // capabilites sent back by provider at connection time
	FetchItems   []imap.FetchItem // provider specific items that we want to fetch
}

type OauthSession struct {
	RequestSecret string
	RequestToken  string
	UserId        string
}
