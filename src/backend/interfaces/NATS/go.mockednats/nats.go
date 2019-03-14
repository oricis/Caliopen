package mockednats

import (
	"errors"
	"github.com/nats-io/gnatsd/server"
	"github.com/nats-io/go-nats"
	"github.com/phayes/freeport"
	"strconv"
	"time"
)

const (
	natsUrl = "0.0.0.0"
)

// GetNats starts an embedded nats server on localhost,
// picking a free available port.
func GetNats() (*server.Server, *nats.Conn, error) {
	// starting an embedded nats server
	port, err := freeport.GetFreePort()
	if err != nil {
		return nil, nil, err
	}
	natsServer, err := server.NewServer(&server.Options{
		Host:     natsUrl,
		Port:     port,
		HTTPPort: -1,
		Cluster:  server.ClusterOpts{Port: -1},
		NoLog:    true,
		NoSigs:   true,
		Debug:    false,
		Trace:    false,
	})
	if err != nil {
		return nil, nil, err
	}
	if natsServer == nil {
		return nil, nil, errors.New("natsServer is nil")
	}

	go natsServer.Start()
	// Wait for accept loop(s) to be started
	if !natsServer.ReadyForConnections(10 * time.Second) {
		return nil, nil, errors.New("timeout waiting nats server ready")
	}

	conn, err := nats.Connect("nats://" + natsUrl + ":" + strconv.Itoa(port))
	if err != nil {
		natsServer.Shutdown()
		return nil, nil, err
	}
	return natsServer, conn, nil
}
