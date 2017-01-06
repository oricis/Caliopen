package broker

import (
	"github.com/flashmob/go-guerrilla"
	"fmt"
	"sync"
	log "github.com/Sirupsen/logrus"
	"time"
	"github.com/nats-io/go-nats"
	"crypto/md5"
	"strings"
	"io"
)

type CaliopenBackend interface {
	GetRecipients([]string) ([]string, error)
	StoreRaw(data string) (raw_id string, err error)
	Initialize(config map[string]interface{}) error
}

type CaliopenBroker struct {
	Backend			*CaliopenBackend
	config       		BrokerConfig
	deliveryMsgChan 	chan *messageDelivery
	natsConn		*nats.Conn
	wg          	 	sync.WaitGroup
}

type BrokerConfig struct {
	BackendName   		string                 	`json:"backend_name"`
	BackendConfig 		map[string]interface{} 	`json:"backend_config"`
	LogReceivedMails	bool			`json:"log_received_mails"`
	NumberOfWorkers    	int  			`json:"broker_workers_size"`
}

func (broker *CaliopenBroker) Initialize(config BrokerConfig) error {
	broker.config = config
	switch broker.config.BackendName {
	case "cassandra":
		b := &CassandraBackend{}
		cb := CaliopenBackend(b)
		broker.Backend = &cb
	case "BOBcassandra":
	// NotImplemented… yet ! ;-)
	default:
		log.Fatalf("Unknown backend: %s", broker.config.BackendName)
	}

	err := (*broker.Backend).Initialize(config.BackendConfig)
	if err != nil {
		log.WithError(err).Errorf("Initalization of %s backend failed", broker.config.BackendName)
		return err
	}

	// start some delivery workers
	broker.deliveryMsgChan = make(chan *messageDelivery, broker.config.NumberOfWorkers)
	broker.wg.Add(broker.config.NumberOfWorkers)
	for i := 0; i < broker.config.NumberOfWorkers; i++ {
		go broker.deliverWorker()
	}

	broker.natsConn, err = nats.Connect(nats.DefaultURL)

	if err != nil {
		log.WithError(err).Errorf("Connection to messages system failed")
		return err
	}

	return nil
}

func (broker *CaliopenBroker) Shutdown() error {
	close(broker.deliveryMsgChan) // workers will stop
	broker.wg.Wait()
	log.Info("Shutdown broker")
	return nil
}

func (broker *CaliopenBroker) Process(mail *guerrilla.Envelope) guerrilla.BackendResult {

	//step 1 : recipients lookup
	//         we need at least one valid recipient before processing further
	to := mail.RcptTo
	if len(to) == 0 {
		return guerrilla.NewBackendResult("554 Error: no recipient")
	}

	if broker.config.LogReceivedMails {
		log.Infof("processing envelope From: %s -> To: %v", mail.MailFrom, to)
	}

	emails := []string{}
	for _, emailAddress := range to {
		emails = append(emails, emailAddress.String())
	}
	localRcpts, err := (*broker.Backend).GetRecipients(emails)

	if err != nil {
		log.WithError(err).Info("recipients lookup failed")
		return guerrilla.NewBackendResult("554 Error: recipients lookup failed")
	}

	if len(localRcpts) == 0 {
		return guerrilla.NewBackendResult("554 Error: no recipient found in Caliopen keyspace")
	}

	//step 2 : store raw email and get its raw_id
	raw_email_id, err := (*broker.Backend).StoreRaw(mail.Data)

	if err != nil {
		log.WithError(err).Info("storing raw email failed")
		return guerrilla.NewBackendResult("554 Error: storing raw email failed")
	}

	//step 3 : feed delivery workers for each recipient
	//TODO: put this logic into another autonomous component ?

	for _, localRcpt := range localRcpts {

		deliveryNotify := make(chan *deliveryStatus)
		broker.deliveryMsgChan <- &messageDelivery{localRcpt, raw_email_id, deliveryNotify}

		//wait for the delivery to complete or timeout after 30sec
		select {
		case status := <- deliveryNotify:
			if status.err != nil {
				return guerrilla.NewBackendResult("554 Error: " + status.err.Error())
			}
			return guerrilla.NewBackendResult(fmt.Sprintf("250 OK : queued as %s", status.hash))
		case <-time.After(time.Second * 30):
			log.Info("timeout")
			return guerrilla.NewBackendResult("554 Error: delivery timeout")
		}
	}

	return guerrilla.NewBackendResult(fmt.Sprintf("250 OK "))
}

type messageDelivery struct {
	recipient		string
	raw_email_id		string
	deliveryNotify		chan *deliveryStatus
}

type deliveryStatus struct {
	err	error
	hash	string
}

func (broker *CaliopenBroker) deliverWorker() {

	//TODO
	//  receives values from the channel repeatedly until it is closed.
	for delivery := range broker.deliveryMsgChan {
		if delivery == nil {
			log.Debug("Delivery payload is empty")
			return
		}
		natsMessage := fmt.Sprintf("{'user_id': '%s', 'raw_email_id': '%s'}", delivery.recipient, delivery.raw_email_id)
		err := broker.natsConn.Publish("inboundSMTPEmail", []byte(natsMessage))
		hash := MD5Hex(natsMessage)
		delivery.deliveryNotify <- &deliveryStatus{err, hash}
	}

	broker.wg.Done()
}

// returns an md5 hash as string of hex characters
func MD5Hex(stringArguments ...string) string {
	h := md5.New()
	var r *strings.Reader
	for i := 0; i < len(stringArguments); i++ {
		r = strings.NewReader(stringArguments[i])
		io.Copy(h, r)
	}
	sum := h.Sum([]byte{})
	return fmt.Sprintf("%x", sum)
}