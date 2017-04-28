// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.
//
// SMTP server to handle in/out emails from/to MTAs

package caliopen_smtp

import (
	broker "github.com/CaliOpen/Caliopen/src/backend/brokers/go.emails"
	log "github.com/Sirupsen/logrus"
	"os/exec"
	"strconv"
	"strings"
)

//Local Delivery Agent, in charge of IO between SMTP server and our email broker
type Lda struct {
	Config           SMTPConfig
	broker           *broker.EmailBroker
	brokerConnectors broker.EmailBrokerConnectors
	inboundListener  *Server
	outboundListener *submitter
}

func (lda *Lda) initialize(config SMTPConfig) (err error) {
	lda.Config = config
	lda.broker, lda.brokerConnectors, err = broker.Initialize(config.LDAConfig)
	return err
}

func (lda *Lda) start() (err error) {

	// Check that max clients is not greater than system open file limit.
	fileLimit := getFileLimit()
	if fileLimit > 0 {
		maxClients := 0
		for _, s := range lda.Config.AppConfig.Servers {
			maxClients += s.MaxClients
		}
		if maxClients > fileLimit {
			log.Fatalf("Combined max clients for all servers (%d) is greater than open file limit (%d). "+
				"Please increase your open file limit or decrease max clients.", maxClients, fileLimit)
		}
	}

	// launch outbound chan listener
	lda.outboundListener, err = lda.newSubmitter()
	if err != nil {
		log.Warn("LDA submitter initialization failed")
	}
	go func() {
		lda.runSubmitterAgent()
	}()

	return
}

func (lda *Lda) shutdown() error {
	lda.broker.ShutDown()
	return nil
}

func getFileLimit() int {
	cmd := exec.Command("ulimit", "-n")
	out, err := cmd.Output()
	if err != nil {
		return -1
	}

	limit, err := strconv.Atoi(strings.TrimSpace(string(out)))
	if err != nil {
		return -1
	}

	return limit
}
