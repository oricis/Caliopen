package REST

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/Sirupsen/logrus"
	"github.com/dghubble/oauth1"
	twitterOAuth1 "github.com/dghubble/oauth1/twitter"
)

const CALLBACK_BASE_URI = "/api/v2/providers/%s/callback"

func (rest *RESTfacility) RetrieveProvidersList() (providers []Provider, err error) {
	if rest.providers != nil {
		providers = []Provider{}
		for _, provider := range rest.providers {
			providers = append(providers, provider)
		}
		return providers, nil
	}
	return providers, errors.New("providers slice is nil")
}
func (rest *RESTfacility) RetrieveProvider(name string) (Provider, error) {
	if provider, ok := rest.providers[name]; ok {
		switch provider.Name {
		case "twitter":
			err := setTwitterAuthRequestUrl(&provider, rest.hostname)
			if err != nil {
				return provider, fmt.Errorf("failed to retrieve Twitter auth request url with error : %s", err)
			}
		}
		return provider, nil
	}
	return Provider{}, errors.New("not found")
}

func (rest *RESTfacility) ProviderCallback() error {
	return errors.New("not implemented")
}


func setTwitterAuthRequestUrl(provider *Provider, hostname string) error {

	logrus.Infof("%+v", *provider)
	provider.OauthCallbackUri = fmt.Sprintf(CALLBACK_BASE_URI, "twitter")

	//IMPORTANT TODO: make use of vault to store consumer key and secret
	conf := &oauth1.Config{
		ConsumerKey:    provider.ConsumerKey,
		ConsumerSecret: provider.ConsumerSecret,
		CallbackURL:    "http://"+ hostname + provider.OauthCallbackUri,
		Endpoint:       twitterOAuth1.AuthorizeEndpoint,
	}
	logrus.Infof("%+v", *conf)
	requestToken, _, err := conf.RequestToken()
	if err != nil {
		//TODO
	}
	authUrl, err := conf.AuthorizationURL(requestToken)
	if err != nil {
		//TODO
	}
	provider.OauthRequestUrl = authUrl.String()
	return nil
}