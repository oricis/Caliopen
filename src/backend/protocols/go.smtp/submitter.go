// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen_smtp

import (
	"crypto/tls"
	broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/gomail.v2"
	"io"
	"net/smtp"
	"sync"
	"time"
)

type submitter struct {
	config          broker.LDAConfig
	workersCountMux sync.Mutex
	runningWorkers  int
	submitChan      chan *broker.SmtpEmail
}

type smtpSender struct {
	smtpClient
	d *gomail.Dialer
}

type smtpClient interface {
	Hello(string) error
	Extension(string) (bool, string)
	StartTLS(*tls.Config) error
	Auth(smtp.Auth) error
	Mail(string) error
	Rcpt(string) error
	Data() (io.WriteCloser, error)
	Quit() error
	Close() error
}

func (server *SMTPServer) newSubmitter() (submit *submitter, err error) {

	submit = &submitter{}
	submit.config = server.Config.LDAConfig
	submit.submitChan = make(chan *broker.SmtpEmail)

	return
}

func (server *SMTPServer) runSubmitterAgent() {

	for email := range server.brokerConnectors.OutcomingSmtp {
		go func(email *broker.SmtpEmail) {
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

	var smtp_sender gomail.SendCloser
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
				if smtp_sender, err = d.Dial(); err != nil {
					log.WithError(err).Warn("outbound: unable to connect to MTA")
					return
				}
				open = true
			}

			from := outcoming.EmailMessage.Email.SmtpMailFrom
			to := outcoming.EmailMessage.Email.SmtpRcpTo
			smtp_sender.Send(from, to, &outcoming.EmailMessage.Email.Raw)

			outcoming.Response <- &broker.DeliveryAck{
				EmailMessage: outcoming.EmailMessage,
				Err:          err,
				Response:     "",
			}
		// Close the connection to the SMTP server and this worker
		// if no email was sent in the last 30 seconds.
		case <-time.After(30 * time.Second):
			if open {
				if err := smtp_sender.Close(); err != nil {
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

func (c *smtpSender) Send(from string, to []string, msg io.WriterTo) error {
	if err := c.Mail(from); err != nil {
		if err == io.EOF {
			// This is probably due to a timeout, so reconnect and try again.
			sc, derr := c.d.Dial()
			if derr == nil {
				if s, ok := sc.(*smtpSender); ok {
					*c = *s
					return c.Send(from, to, msg)
				}
			}
		}
		return err
	}

	for _, addr := range to {
		if err := c.Rcpt(addr); err != nil {
			return err
		}
	}

	w, err := c.Data()
	if err != nil {
		return err
	}

	if _, err = msg.WriteTo(w); err != nil {
		w.Close()
		return err
	}

	return w.Close()
}
