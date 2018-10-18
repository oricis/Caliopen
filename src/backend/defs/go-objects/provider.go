package objects

type Provider struct {
	ConsumerKey      string `json:"-"                                mapstructure:"consumer_key"`
	ConsumerSecret   string `json:"-"                                mapstructure:"consumer_secret"`
	Name             string `json:"name"                             mapstructure:"name"`
	OauthCallbackUri string `json:"oauth_callback_uri,omitempty"     mapstructure:"oauth_callback_uri"`
	OauthRequestUrl  string `json:"oauth_request_url,omitempty"      mapstructure:"oauth_request_url"`
	Protocol         string `json:"protocol"                         mapstructure:"protocol"`
}

type OauthSession struct {
	RequestSecret string
	RequestToken  string
	UserId        string
}
