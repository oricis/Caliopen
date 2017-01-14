package lda

// Local Delivery Agent
// store the raw email and give it to email lda via NATS topic « inboundSMTPEmail »

import (
	"crypto/md5"
	"fmt"
	"github.com/CaliOpen/CaliOpen/src/backend/protocols/go.smtp/backends"
	log "github.com/Sirupsen/logrus"
	"github.com/flashmob/go-guerrilla"
	"github.com/hashicorp/go-multierror"
	"github.com/nats-io/go-nats"
	"io"
	"strings"
	"sync"
	"time"
)

type CaliopenBackend interface {
	GetRecipients([]string) ([]string, error)
	StoreRaw(data string) (raw_id string, err error)
	Initialize(config map[string]interface{}) error
}

type CaliopenLDA struct {
	Backend         *CaliopenBackend
	config          LDAConfig
	deliveryMsgChan chan *messageDelivery
	natsConn        *nats.Conn
	wg              sync.WaitGroup
}

type LDAConfig struct {
	BackendName      string                 `json:"backend_name"`
	BackendConfig    map[string]interface{} `json:"backend_config"`
	LogReceivedMails bool                   `json:"log_received_mails"`
	NumberOfWorkers  int                    `json:"lda_workers_size"`
}

func (lda *CaliopenLDA) Initialize(config LDAConfig) error {
	lda.config = config
	switch lda.config.BackendName {
	case "cassandra":
		b := &backends.CassandraBackend{}
		cb := CaliopenBackend(b)
		lda.Backend = &cb
	case "BOBcassandra":
	// NotImplemented… yet ! ;-)
	default:
		log.Fatalf("Unknown backend: %s", lda.config.BackendName)
	}

	err := (*lda.Backend).Initialize(config.BackendConfig)
	if err != nil {
		log.WithError(err).Fatalf("Initalization of %s backend failed", lda.config.BackendName)
	}

	// start some delivery workers
	lda.deliveryMsgChan = make(chan *messageDelivery, lda.config.NumberOfWorkers)
	lda.wg.Add(lda.config.NumberOfWorkers)
	for i := 0; i < lda.config.NumberOfWorkers; i++ {
		go lda.deliverWorker()
	}

	lda.natsConn, err = nats.Connect(nats.DefaultURL)

	if err != nil {
		log.WithError(err).Errorf("Connection to messages system failed")
		return err
	}

	return nil
}

func (lda *CaliopenLDA) Shutdown() error {
	close(lda.deliveryMsgChan) // workers will stop
	lda.wg.Wait()
	log.Info("Shutdown lda")
	return nil
}

func (lda *CaliopenLDA) Process(mail *guerrilla.Envelope) guerrilla.BackendResult {

	//step 1 : recipients lookup
	//         we need at least one valid recipient before processing further
	to := mail.RcptTo
	if len(to) == 0 {
		return guerrilla.NewBackendResult("554 Error: no recipient")
	}

	if lda.config.LogReceivedMails {
		log.Infof("processing envelope From: %s -> To: %v", mail.MailFrom, to)
	}

	emails := []string{}
	for _, emailAddress := range to {
		emails = append(emails, emailAddress.String())
	}
	localRcpts, err := (*lda.Backend).GetRecipients(emails)

	if err != nil {
		log.WithError(err).Info("recipients lookup failed")
		return guerrilla.NewBackendResult("554 Error: recipients lookup failed")
	}

	if len(localRcpts) == 0 {
		return guerrilla.NewBackendResult("554 Error: no recipient found in Caliopen keyspace")
	}

	//step 2 : store raw email and get its raw_id
	raw_email_id, err := (*lda.Backend).StoreRaw(mail.Data)

	if err != nil {
		log.WithError(err).Info("storing raw email failed")
		return guerrilla.NewBackendResult("554 Error: storing raw email failed")
	}

	//step 3 : feed delivery workers for each recipient
	deliveryWG := sync.WaitGroup{}
	deliveryWG.Add(len(localRcpts))
	var errs error
	deliveries := 0
	for _, localRcpt := range localRcpts {
		go func() {
			defer deliveryWG.Done()
			deliveryNotify := make(chan *deliveryStatus)
			lda.deliveryMsgChan <- &messageDelivery{localRcpt, raw_email_id, deliveryNotify}

			//wait for the delivery to complete or timeout after 30sec
			select {
			case status := <-deliveryNotify:
				if status.err != nil {
					errs = multierror.Append(errs, err)
					return
				}
				deliveries++
				return
			case <-time.After(time.Second * 30):
				errs = multierror.Append(errs, err)
				return
			}
		}()
	}
	deliveryWG.Wait()

	// we assume the previous MTA did the rcpts lookup, so all rcpts should be OK
	// consequently, we discard the whole delivery if there is at least one error
	if errs != nil {
		return guerrilla.NewBackendResult(fmt.Sprint("554 Error : " + errs.Error()))
	}

	return guerrilla.NewBackendResult(fmt.Sprintf("250 OK: %d message(s) delivered.", deliveries))
}

type messageDelivery struct {
	recipient      string
	raw_email_id   string
	deliveryNotify chan *deliveryStatus
}

type deliveryStatus struct {
	err  error
	hash string
}

func (lda *CaliopenLDA) deliverWorker() {
	//  receives values from the channel repeatedly until shutdown msg
	for delivery := range lda.deliveryMsgChan {
		if delivery == nil {
			log.Debug("Delivery payload is empty")
			return
		}
		natsMessage := fmt.Sprintf("{\"user_id\": \"%s\", \"raw_email_id\": \"%s\"}", delivery.recipient, delivery.raw_email_id)
		err := lda.natsConn.Publish("inboundSMTP", []byte(natsMessage))
		hash := MD5Hex(natsMessage)
		delivery.deliveryNotify <- &deliveryStatus{err, hash}
	}
	lda.wg.Done()
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
