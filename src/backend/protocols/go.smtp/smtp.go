// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.
//
// SMTP server to handle in/out emails from/to MTAs

package caliopen_smtp

import (
	broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"
	log "github.com/Sirupsen/logrus"
	"github.com/flashmob/go-guerrilla"
	"os/exec"
	"strconv"
	"strings"
)

var (
	server *SMTPServer
)

type SMTPServer struct {
	Config           SMTPConfig
	broker           *broker.EmailBroker
	brokerConnectors broker.EmailBrokerConnectors
	inboundListener  guerrilla.Guerrilla
	outboundListener *submitter
}

func InitializeServer(config SMTPConfig) error {
	server = new(SMTPServer)
	return server.initialize(config)
}

func (server *SMTPServer) initialize(config SMTPConfig) (err error) {
	server.Config = config
	server.broker, server.brokerConnectors, err = broker.Initialize(config.LDAConfig)
	return err
}

func StartServer() error {
	return server.start()
}

func (server *SMTPServer) start() (err error) {

	// Check that max clients is not greater than system open file limit.
	fileLimit := getFileLimit()
	if fileLimit > 0 {
		maxClients := 0
		for _, s := range server.Config.AppConfig.Servers {
			maxClients += s.MaxClients
		}
		if maxClients > fileLimit {
			log.Fatalf("Combined max clients for all servers (%d) is greater than open file limit (%d). "+
				"Please increase your open file limit or decrease max clients.", maxClients, fileLimit)
		}
	}

	// launch outbound chan listener
	server.outboundListener, err = server.newSubmitter()
	if err != nil {
		log.WithError(err).Warn("SMTP submitter initialization failed")
	}
	go func() {
		server.runSubmitterAgent()
	}()
	log.Infof("Caliopen smtp started")

	// launch SMTP inbound listener
	var b guerrilla.Backend
	b = guerrilla.Backend(server) // type conversion. guerrilla.Backend is an interface.
	gConfig := guerrilla.AppConfig{
		AllowedHosts: server.Config.AppConfig.AllowedHosts,
	}

	for _, serv := range server.Config.AppConfig.Servers {
		gServer := guerrilla.ServerConfig{
			IsEnabled:       serv.IsEnabled,
			Hostname:        serv.Hostname,
			AllowedHosts:    server.Config.AppConfig.AllowedHosts[:],
			MaxSize:         serv.MaxSize,
			PrivateKeyFile:  serv.PrivateKeyFile,
			PublicKeyFile:   serv.PublicKeyFile,
			Timeout:         serv.Timeout,
			ListenInterface: serv.ListenInterface,
			StartTLSOn:      serv.StartTLSOn,
			TLSAlwaysOn:     serv.TLSAlwaysOn,
			MaxClients:      serv.MaxClients,
		}
		gConfig.Servers = append(gConfig.Servers, gServer)
	}
	server.inboundListener = guerrilla.New(&gConfig, &b)
	server.inboundListener.Start()

	return err
}

func ShutdownServer() error {
	return server.Shutdown()
}

func (server *SMTPServer) Shutdown() error {
	server.broker.ShutDown()
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
