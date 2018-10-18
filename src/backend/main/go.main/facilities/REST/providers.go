package REST

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/go-twitter/twitter"
	"github.com/Sirupsen/logrus"
	"github.com/dghubble/oauth1"
	twitterOAuth1 "github.com/dghubble/oauth1/twitter"
	"github.com/satori/go.uuid"
	"net/http"
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

// RetrieveProvider returns provider's params required for client to initiate an Oauth request
// In case of Twitter, auth request url is requested from twitter API endpoint on the fly.
// For all requests, an Oauth session cache is initialized for requesting user, making use of cache facility.
func (rest *RESTfacility) RetrieveProvider(userId, name string) (Provider, error) {
	if provider, ok := rest.providers[name]; ok {
		switch provider.Name {
		case "twitter":
			requestToken, requestSecret, err := setTwitterAuthRequestUrl(&provider, rest.hostname)
			if err != nil {
				return provider, fmt.Errorf("failed to retrieve Twitter auth request url with error : %s", err)
			}
			rest.Cache.SetOauthSession(requestToken, &OauthSession{
				RequestSecret: requestSecret,
				RequestToken:  requestToken,
				UserId:        userId,
			})
		default:
			return Provider{}, errors.New("not implemented")
		}
		return provider, nil
	}
	return Provider{}, errors.New("not found")
}

func (rest *RESTfacility) CreateTwitterIdentity(requestToken, verifier string) (remoteId string, err error) {
	provider := rest.providers[TwitterProtocol]
	conf := &oauth1.Config{
		ConsumerKey:    provider.ConsumerKey,
		ConsumerSecret: provider.ConsumerSecret,
		Endpoint:       twitterOAuth1.AuthorizeEndpoint,
	}
	oauthCache, err := rest.Cache.GetOauthSession(requestToken)
	if err != nil {
		//TODO
	}
	accessToken, accessSecret, err := conf.AccessToken(requestToken, oauthCache.RequestSecret, verifier)
	if err != nil {
		//TODO
	}

	// retrieve twitter profile from Twitter api
	token := oauth1.NewToken(accessToken, accessSecret)
	httpClient := conf.Client(oauth1.NoContext, token)
	twitterClient := twitter.NewClient(httpClient)
	accountVerifyParams := &twitter.AccountVerifyParams{
		IncludeEntities: twitter.Bool(false),
		SkipStatus:      twitter.Bool(true),
		IncludeEmail:    twitter.Bool(false),
	}
	twitterUser, resp, err := twitterClient.Accounts.VerifyCredentials(accountVerifyParams)
	if err != nil || resp.StatusCode != http.StatusOK {
		return "", errors.New("twitter: unable to get Twitter User")
	}
	if twitterUser == nil || twitterUser.ID == 0 || twitterUser.IDStr == "" {
		return "", errors.New("twitter: unable to get Twitter User")
	}
	// build user identity
	//1.check if this user_identity already exists
	foundIdentities, err := rest.store.LookupIdentityByIdentifier(twitterUser.ScreenName, TwitterProtocol)
	if err != nil {
		logrus.Warn(err)
		//TODO
	}
	if len(foundIdentities) > 0 {
		logrus.Warn("identity already exist")
		//TODO: update current
		return "", fmt.Errorf("twitter account alreadry registred in Caliopen. CASE NOT (YET) IMPLEMENTED")
	}
	userIdentity := new(UserIdentity)
	userID := UUID(uuid.FromStringOrNil(oauthCache.UserId))
	userIdentity.MarshallNew(userID)
	userIdentity.Protocol = TwitterProtocol
	userIdentity.Type = RemoteIdentity
	userIdentity.DisplayName = twitterUser.Name
	userIdentity.Identifier = twitterUser.ScreenName
	userIdentity.Credentials = &Credentials{
		"token":  accessToken,
		"secret": accessSecret,
	}

	// save identity
	logrus.Infof("%+v", *userIdentity)
	e := rest.CreateUserIdentity(userIdentity)
	if e != nil {
		logrus.Warn(e)
		//TODO
	}
	return userIdentity.Id.String(), nil
}

func setTwitterAuthRequestUrl(provider *Provider, hostname string) (requestToken, requestSecret string, err error) {

	provider.OauthCallbackUri = fmt.Sprintf(CALLBACK_BASE_URI, "twitter")

	//IMPORTANT TODO: make use of vault to store consumer key and secret
	conf := &oauth1.Config{
		ConsumerKey:    provider.ConsumerKey,
		ConsumerSecret: provider.ConsumerSecret,
		CallbackURL:    "http://" + hostname + provider.OauthCallbackUri,
		Endpoint:       twitterOAuth1.AuthorizeEndpoint,
	}
	requestToken, requestSecret, err = conf.RequestToken()
	if err != nil {
		//TODO
	}
	authUrl, err := conf.AuthorizationURL(requestToken)
	if err != nil {
		//TODO
	}
	provider.OauthRequestUrl = authUrl.String()
	return
}
