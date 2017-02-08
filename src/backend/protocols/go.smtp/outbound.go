// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

/*
- subscribe to 'deliver' topic on NATS channel 'outboundSMTP'
- manage a pool of outboundDaemon(s)
- for each incoming NATS message
	retrieve message from db
	build email
	store raw_email
	forward email to MTA (postfix) via outboundDaemon(s)
*/
package caliopen_smtp

import (
	log "github.com/Sirupsen/logrus"
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
		emailChan       chan *gomail.Message
		workersCountMux sync.Mutex
		runningWorkers  int
		config          OutConfig
	}
)

func (server *SMTPServer) InitializeOutAgent(config OutConfig) error {
	server.OutAgent = new(OutAgent)
	server.OutAgent.config = config
	return server.OutAgent.initialize()
}

func (outA *OutAgent) initialize() error {

	outA.emailChan = make(chan *gomail.Message)
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
			resp, err := natsMsgHandler(outA, msg)
			if err != nil {
				//handle error
			}
			nc.Publish(msg.Reply, []byte(resp))
		})
		nc.Flush()
	}

	//TODO: error handling
	return nil
}

func natsMsgHandler(agent *OutAgent, msg *nats.Msg) (resp string, err error) {
	//process message
	agent.workersCountMux.Lock()
	if agent.runningWorkers < agent.config.NumberOfWorkers {
		go agent.OutboundWorker()
		agent.runningWorkers++
	}
	agent.workersCountMux.Unlock()
	m := gomail.NewMessage()
	m.SetHeader("From", "alex@example.com")
	m.SetHeader("To", "bob@example.com", "cora@example.com")
	m.SetAddressHeader("Cc", "dan@example.com", "Dan")
	m.SetHeader("Subject", "Hello!")
	m.SetBody("text/html", "Hello <b>Bob</b> and <i>Cora</i>!")

	agent.emailChan <- m
	log.Info("email sent into chan")
	return resp, err
}

// Outbound worker listens to emailChan for emails
// dials to MTA and maintains connection open to handle outbound deliveries,
// then close the connection if no email comes in emailChan chan for 30 sec.
// should be launched in a goroutine
func (agent *OutAgent) OutboundWorker() {
	c := agent.config
	d := gomail.NewDialer(c.SubmitAddress, c.SubmitPort, c.SubmitUser, c.SubmitPassword)
	//d := gomail.NewDialer("localhost", 2500, "", "")
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
		case m, ok := <-agent.emailChan:
			if !ok {
				return
			}
			if !open {
				if s, err = d.Dial(); err != nil {
					panic(err)
				}
				open = true
			}
			if err := gomail.Send(s, m); err != nil {
				log.Print(err)
			}
		// Close the connection to the SMTP server and this worker
		// if no email was sent in the last 30 seconds.
		case <-time.After(30 * time.Second):
			log.Info("closing connexion to mta")
			if open {
				if err := s.Close(); err != nil {
					panic(err)
				}
				open = false
			}
			return
		}
	}
}

func SendEmail() (err error) {
	m := gomail.NewMessage()
	m.SetHeader("From", "alex@example.com")
	m.SetHeader("To", "bob@example.com", "cora@example.com")
	m.SetAddressHeader("Cc", "dan@example.com", "Dan")
	m.SetHeader("Subject", "Hello!")
	m.SetBody("text/html", "Hello <b>Bob</b> and <i>Cora</i>!")

	//add X-Mailer header
	//add Message-ID header ? (or let postfix add it ?)

	d := gomail.NewDialer("localhost", 2500, "", "")

	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}
	return
}
