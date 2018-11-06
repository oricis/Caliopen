// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package twitterworker

import (
	"encoding/json"
	"errors"
	"fmt"
	broker "github.com/CaliOpen/Caliopen/src/backend/brokers/go.twitter"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/go-twitter/twitter"
	"github.com/Sirupsen/logrus"
	log "github.com/Sirupsen/logrus"
	"github.com/dghubble/oauth1"
	"sort"
	"strconv"
	"strings"
	"time"
)

type (
	AccountWorker struct {
		WorkerDesk       chan uint
		broker           *broker.TwitterBroker
		lastDMseen       string
		twitterClient    *twitter.Client
		userAccount      *TwitterAccount
		usersScreenNames map[int64]string // a cache facility to avoid calling too often twitter API for screen_name lookup
	}

	TwitterAccount struct {
		accessToken       string
		accessTokenSecret string
		userID            UUID
		remoteID          UUID
		screenName        string
	}
)

const (
	//WorkerDesk commands
	PollDM = uint(iota)
	PollTimeLine
	Stop

	lastSeenInfosKey = "lastseendm"
	lastSyncInfosKey = "lastsync"

	lastErrorKey      = "lastFetchError"
	dateFirstErrorKey = "firstErrorDate"
	dateLastErrorKey  = "lastErrorDate"
	errorsCountKey    = "errorsCount"
)



// NewWorker create a worker dedicated to a specific twitter account.
// A worker holds remote identity credentials and data, as well as user context connection to twitter API.
func NewAccountWorker(userID, remoteID string, conf WorkerConfig) (accountWorker *AccountWorker, err error) {
	accountWorker = new(AccountWorker)
	accountWorker.WorkerDesk = make(chan uint, 3)
	b, e := broker.Initialize(conf.BrokerConfig)
	if e != nil {
		err = fmt.Errorf("[TwitterWorker]NewAccountWorker failed to initialize a twitter broker : %s", e)
		return nil, err
	}
	accountWorker.broker = b
	var remote *UserIdentity
	// retrieve data from db
	remote, err = accountWorker.broker.Store.RetrieveUserIdentity(userID, remoteID, true)
	if err != nil {
		log.WithError(err).Infof("[PollDM] failed to retrieve remote identity <%s> (user <%s>)", remoteID, userID)
		return
	}
	if remote.Credentials == nil {
		log.WithError(err).Infof("[PollDM] failed to retrieve credentials for remote identity <%s> (user <%s>)", remoteID, userID)
		return
	}
	accountWorker.userAccount = &TwitterAccount{
		accessToken:       (*remote.Credentials)["token"],
		accessTokenSecret: (*remote.Credentials)["secret"],
		userID:            remote.UserId,
		remoteID:          remote.Id,
		screenName:        remote.Identifier,
	}
	if lastseen, ok := remote.Infos[lastSeenInfosKey]; ok {
		accountWorker.lastDMseen = lastseen
	}

	authConf := oauth1.NewConfig(conf.TwitterAppKey, conf.TwitterAppSecret)
	token := oauth1.NewToken(accountWorker.userAccount.accessToken, accountWorker.userAccount.accessTokenSecret)
	httpClient := authConf.Client(oauth1.NoContext, token)
	if accountWorker.twitterClient = twitter.NewClient(httpClient); accountWorker.twitterClient == nil {
		return nil, errors.New("[NewWorker] twitter api failed to create http client")
	}

	accountWorker.usersScreenNames = map[int64]string{}

	return
}



// Start begins infinite loop, until receiving stop order. This func must be call within goroutine.
func (worker *AccountWorker) Start() {
	go func(w *AccountWorker) {
		for {
			select {
			case egress, ok := <-worker.broker.Connectors.Egress:
				if !ok {
					log.Infof("Egress chan for worker %s has been closed. Shutting-down it.", worker.userAccount.userID.String()+worker.userAccount.remoteID.String())
					worker.WorkerDesk <- Stop
					return
				}
				err := worker.SendDM(egress.Order)
				if err != nil {
					egress.Ack <- &DeliveryAck{
						Err:      true,
						Response: err.Error(),
					}
				} else {
					egress.Ack <- &DeliveryAck{
						Err:      false,
						Response: "OK",
					}
				}
			case <-worker.broker.Connectors.Halt:
				worker.WorkerDesk <- Stop
				return
			}
		}
	}(worker)

deskLoop:
	for command := range worker.WorkerDesk {
		switch command {
		case PollDM:
			worker.PollDM()
		case Stop:
			worker.Stop()
			break deskLoop
		default:
			logrus.Warnf("worker received unknown command number %d", command)
		}
	}
}

func (worker *AccountWorker) Stop() {
	// destroy broker
	worker.broker.ShutDown()
	// close desk
	if _, ok := <-worker.WorkerDesk; ok {
		close(worker.WorkerDesk)
	}
}

// PollDM calls Twitter API endpoint to fetch DM for worker
func (worker *AccountWorker) PollDM() {
	DMs, _, err := worker.twitterClient.DirectMessages.EventsList(&twitter.DirectMessageEventsListParams{Count: 10})
	if err == nil {
		accountInfos, retrieveErr := worker.broker.Store.RetrieveRemoteInfosMap(worker.userAccount.userID.String(), worker.userAccount.remoteID.String())
		if retrieveErr == nil {
			if e, ok := err.(twitter.APIError); ok {
				var rateLimitError bool
				errorsMessages := new(strings.Builder)
				for _, err := range e.Errors {
					if err.Code == 88 {
						rateLimitError = true
						log.Infof("twitter returned rate limit error, slowing down worker for account @%s", worker.userAccount.screenName)
						if pollInterval, ok := accountInfos["pollinterval"]; ok {
							interval, e := strconv.Atoi(pollInterval)
							if e == nil {
								newInterval := strconv.Itoa(interval * 2)
								accountInfos["pollinterval"] = newInterval
								worker.broker.Store.UpdateRemoteInfosMap(worker.userAccount.userID.String(), worker.userAccount.remoteID.String(), accountInfos)
								order := RemoteIDNatsMessage{
									IdentityId:   worker.userAccount.remoteID.String(),
									Order:        "update_interval",
									PollInterval: newInterval,
									Protocol:     "twitter",
									UserId:       worker.userAccount.userID.String(),
								}
								jorder, jerr := json.Marshal(order)
								if jerr == nil {
									worker.broker.NatsConn.Publish("idCache", jorder)
								}
							}
						}
						break
					} else {
						errorsMessages.WriteString(err.Message + " ")
					}
				}
				if !rateLimitError {
					accountInfos[lastErrorKey] = errorsMessages.String()
					worker.broker.Store.UpdateRemoteInfosMap(worker.userAccount.userID.String(), worker.userAccount.remoteID.String(), accountInfos)
				}
			}
		} else {
			logrus.WithError(retrieveErr).Warnf("[TwitterWorker] PollDM failed to retrieve infos map for account @%s (remote %s, user %s)", worker.userAccount.screenName, worker.userAccount.remoteID.String(), worker.userAccount.userID.String())
		}
	} else {
		logrus.WithError(err).Warnf("[TwitterWorker] PollDM failed for account @%s (remote %s, user %s)", worker.userAccount.screenName, worker.userAccount.remoteID.String(), worker.userAccount.userID.String())
		return
	}

	sort.Sort(ByAscID(DMs.Events)) // reverse events order to get older DMs first
	if len(DMs.Events) > 0 && worker.dmNotSeen(DMs.Events[0]) {
		//TODO: handle pagination with `cursor` param
	}

	for _, event := range DMs.Events {
		if worker.dmNotSeen(event) {
			//lookup sender's screen_name because it's not embedded in event object
			var senderName string
			var inCache bool
			senderID, err := strconv.ParseInt(event.Message.SenderID, 10, 64)
			if err == nil {
				if senderName, inCache = worker.usersScreenNames[senderID]; !inCache {
					users, _, err := worker.twitterClient.Users.Lookup(&twitter.UserLookupParams{UserID: []int64{senderID}})
					if err == nil && len(users) > 0 {
						senderName = users[0].ScreenName
						worker.usersScreenNames[senderID] = senderName
					}
				}
			}
			event.Message.SenderScreenName = senderName
			event.Message.Target.RecipientScreenName = worker.userAccount.screenName
			//TODO: handle DM sent by user : remove or not ?
			err = worker.broker.ProcessInDM(worker.userAccount.userID, worker.userAccount.remoteID, &event, true)
			if err != nil {
				// something went wrong, forget this DM id
				logrus.WithError(err).Warnf("[TwitterWorker] ProcessInDM failed for event : %+v", event)
				continue
			}
			worker.lastDMseen = event.ID
		}
	}
	//TODO: write lastsync & last_check to remote identity in db at last
}

func (worker *AccountWorker) dmNotSeen(event twitter.DirectMessageEvent) bool {
	return worker.lastDMseen < event.ID
}

// SendDM delivers DM to Twitter endpoint and give back Twitter's response to broker.
func (worker *AccountWorker) SendDM(order BrokerOrder) error {
	// make use of broker to marshal a direct message
	brokerPort := make(chan *broker.DMpayload)
	var brokerMessage *broker.DMpayload

	go worker.broker.ProcessOutDM(order, brokerPort)

	select {
	case brokerMessage = <-brokerPort:
		if brokerMessage.Err != nil {
			return brokerMessage.Err
		}
	case <-time.After(10 * time.Second):
		return errors.New("[SendDM] broker timeout")
	}

	// retrieve recipient's twitter ID from DM's screenName
	user, _, userErr := worker.twitterClient.Users.Show(&twitter.UserShowParams{
		ScreenName: brokerMessage.DM.Message.Target.RecipientScreenName,
	})
	if userErr != nil {
		brokerMessage.Response <- broker.TwitterDeliveryAck{
			Err:      true,
			Response: userErr.Error(),
		}
		return userErr
	}
	brokerMessage.DM.Message.Target.RecipientID = user.IDStr

	// deliver DM through Twitter API
	createResponse, _, errResponse := worker.twitterClient.DirectMessages.EventsCreate(brokerMessage.DM.Message)
	if errResponse != nil {
		brokerMessage.Response <- broker.TwitterDeliveryAck{
			Payload:  createResponse,
			Err:      true,
			Response: errResponse.Error(),
		}
		return errResponse
	}

	// give back Twitter's reply to broker for it finishes its job
	brokerMessage.Response <- broker.TwitterDeliveryAck{
		Payload: createResponse,
	}

	select {
	case brokerMessage = <-brokerPort:
		if brokerMessage.Err != nil {
			return brokerMessage.Err
		}
		return nil
	case <-time.After(10 * time.Second):
		return errors.New("[SendDM] broker timeout")
	}
}

// sort interface
type ByAscID []twitter.DirectMessageEvent

func (bri ByAscID) Len() int {
	return len(bri)
}

func (bri ByAscID) Less(i, j int) bool {
	return bri[i].ID < bri[j].ID
}

func (bri ByAscID) Swap(i, j int) {
	bri[i], bri[j] = bri[j], bri[i]
}
