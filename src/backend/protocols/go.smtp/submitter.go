// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen_smtp

import (
	broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/gomail.v2"
	"sync"
	"time"
)

type submitter struct {
	config          broker.LDAConfig
	workersCountMux sync.Mutex
	runningWorkers  int
	submitChan      chan *broker.OutcomingSmtpEmail
}

func (server *SMTPServer) newSubmitter() (submit *submitter, err error) {

	submit = &submitter{}
	submit.config = server.Config.LDAConfig
	submit.submitChan = make(chan *broker.OutcomingSmtpEmail)

	return
}

func (server *SMTPServer) runSubmitterAgent() {

	for email := range server.brokerConnectors.OutcomingSmtp {
		log.Info("got outcoming smtp")
		go func(email *broker.OutcomingSmtpEmail) {
			server.outboundListener.workersCountMux.Lock()
			if server.outboundListener.runningWorkers < server.Config.AppConfig.OutWorkers {
				go server.OutboundWorker()
				server.outboundListener.runningWorkers++
			}
			server.outboundListener.workersCountMux.Unlock()

			//submit email
			server.outboundListener.submitChan <- email
		}(email)
	}

}

/*  OutboundWorker dials to MTA and maintains connection open to handle outbound deliveries,
then close the connection if no email comes in for 30 sec.
should be launched in a goroutine
*/
func (server *SMTPServer) OutboundWorker() {
	c := server.Config.AppConfig
	d := gomail.NewDialer(c.SubmitAddress, c.SubmitPort, c.SubmitUser, c.SubmitPassword)
	defer func() {
		server.outboundListener.workersCountMux.Lock()
		server.outboundListener.runningWorkers--
		server.outboundListener.workersCountMux.Unlock()
	}()

	var s gomail.SendCloser
	var err error
	open := false
	for {
		select {
		case outcoming, ok := <-server.outboundListener.submitChan:
			if !ok {
				//TODO
				return
			}
			if !open {
				if s, err = d.Dial(); err != nil {
					log.WithError(err).Warn("outbound: unable to connect to MTA")
					return
				}
				open = true
			}
			err := gomail.Send(s, outcoming.EmailMessage.Email.Components)
			outcoming.Response <- &broker.DeliveryAck{
				EmailMessage: outcoming.EmailMessage,
				Err:          err,
				Response:     "",
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

func (sub *submitter) shutdown() {

}
