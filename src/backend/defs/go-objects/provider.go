package objects

type Provider struct {
	Name            string `json:"name"`
	OauthRequestUrl string `json:"oauth_auth_url"`
	Protocol        string `json:"protocol"`
}
