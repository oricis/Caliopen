// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

/*
- subscribe to 'deliver' topic on NATS channel 'outboundSMTP'
- manage a pool of outboundDaemon(s)
- for each incoming NATS message
	retrieve message from db
	build email
	forward email to MTA (postfix) via outboundDaemon(s)
	store the sent raw_email
*/
package caliopen_smtp

import (
	"encoding/json"
	obj "github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/CaliOpen/CaliOpen/src/backend/main/go.backends"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
	"gopkg.in/gomail.v2"
	"sync"
	"time"
)

type (
	OutConfig struct {
		SubmitAddress   string `mapstructure:"submit_address"`
		SubmitPort      int    `mapstructure:"submit_port"`
		SubmitUser      string `mapstructure:"submit_user"`
		SubmitPassword  string `mapstructure:"submit_password"`
		NatsUrl         string `mapstructure:"nats_url"`
		NatsTopic       string `mapstructure:"nats_topic"`
		NatsListeners   int    `mapstructure:"nats_listeners"`
		NumberOfWorkers int    `mapstructure:"mta_workers"`
	}
	OutAgent struct {
		natsConn        []*nats.Conn
		emailChan       chan *Email
		deliveryAckChan chan deliveryAck
		workersCountMux sync.Mutex
		runningWorkers  int
		config          OutConfig
		Backend         backends.LDABackend
	}
	natsOrder struct {
		Order     string `json:"order"`
		MessageId string `json:"message_id"`
		UserId    string `json:"user_id"`
	}
	deliveryAck struct {
		email *Email
		err  error
	}
)

func (server *SMTPServer) InitializeOutAgent(config OutConfig) error {
	server.OutAgent = new(OutAgent)
	server.OutAgent.config = config
	return server.OutAgent.initialize(server.lda.Backend) // for now we use the lda backend, we could change this with config.
}

func (outA *OutAgent) initialize(b backends.LDABackend) error {

	outA.Backend = b
	outA.emailChan = make(chan *Email, outA.config.NumberOfWorkers)
	outA.deliveryAckChan = make(chan deliveryAck, outA.config.NatsListeners)
	//nats listener(s)
	server.OutAgent.natsConn = make([]*nats.Conn, outA.config.NatsListeners)
	for i := 0; i < outA.config.NatsListeners; i++ {
		nc, err := nats.Connect(outA.config.NatsUrl)
		if err != nil {
			log.Fatalf("Can't connect: %v\n", err)
		}

		topic := outA.config.NatsTopic
		outA.natsConn[i] = nc

		nc.Subscribe(topic, func(msg *nats.Msg) {
			outA.natsMsgHandler(msg, i)
		})
		nc.Flush()
	}

	//TODO: error handling
	return nil
}

// retrieves a caliopen message from db, build an email from it
// sends the email to recipient(s) and stores the raw email sent in db
func (agent *OutAgent) natsMsgHandler(msg *nats.Msg, natsConnID int) (resp string, err error) {
	var order natsOrder
	json.Unmarshal(msg.Data, &order)

	if order.Order == "deliver" {
		//retrieve message from db
		m, err := agent.Backend.GetMessage(order.UserId, order.MessageId)
		if err != nil {
			log.Warn(err)
			//TODO
		}

		e, err := MarshalEmail(m, server.config.Version)
		if err != nil {
			log.Warn(err)
			//TODO
		}

		//process email
		agent.workersCountMux.Lock()
		if agent.runningWorkers < agent.config.NumberOfWorkers {
			go agent.OutboundWorker()
			agent.runningWorkers++
		}
		agent.workersCountMux.Unlock()

		agent.emailChan <- e
		// non-blocking wait for delivery ack
		go func() {
			select {
			case e, ok := <-agent.deliveryAckChan:
				if e.err != nil || !ok {
					//TODO
					log.WithError(err).Warn("outbound: delivery error from MTA")
				} else {
					err = agent.SaveSentEmail(e)
					if err != nil {
						//TODO
					}
				}
			}
			return
		}()

	}
	return resp, err
}

// Outbound worker listens to emailChan for emails
// dials to MTA and maintains connection open to handle outbound deliveries,
// then close the connection if no email comes in emailChan chan for 30 sec.
// should be launched in a goroutine
func (agent *OutAgent) OutboundWorker() {
	c := agent.config
	d := gomail.NewDialer(c.SubmitAddress, c.SubmitPort, c.SubmitUser, c.SubmitPassword)
	defer func() {
		agent.workersCountMux.Lock()
		agent.runningWorkers--
		agent.workersCountMux.Unlock()
	}()

	var s gomail.SendCloser
	var err error
	open := false
	for {
		select {
		case e, ok := <-agent.emailChan:
			if !ok {
				return
			}
			if !open {
				if s, err = d.Dial(); err != nil {
					log.WithError(err).Warn("outbound: unable to connect to MTA")
					return
				}
				open = true
			}
			err := gomail.Send(s, e.mail)
			agent.deliveryAckChan <- deliveryAck{
				e,
				err,
			}
		// Close the connection to the SMTP server and this worker
		// if no email was sent in the last 30 seconds.
		case <-time.After(30 * time.Second):
			log.Info("closing connexion to mta")
			if open {
				if err := s.Close(); err != nil {
					log.WithError(err).Warn("outbound: unable to close connection to MTA")
				}
				open = false
			}
			return
		}
	}
}

func (agent *OutAgent) getCaliopenMessage(msg_id string) (message obj.MessageModel, err error) {
	message = obj.MessageModel{
		From: "stan@caliopen.org",
		Recipients: []obj.RecipientModel{
			{Address: "bob@example.com", RecipientType: "to"},
			{Address: "cora@example.com", RecipientType: "to"},
			{Address: "dan@example.com", RecipientType: "cc"},
		},
		Subject:    "Hello from a fake message",
		Body:       "This a very simple body of a message",
		Message_id: gocql.TimeUUID(),
	}
	return
}

// bespoke implementation of the json.Unmarshaler interface
// assuming well formatted message
func (msg *natsOrder) UnmarshalJSON(data []byte) error {
	msg.Order = string(data[10:17])
	msg.MessageId = string(data[34:70])
	msg.UserId = string(data[84:120])
	//TODO: error handling
	return nil
}
