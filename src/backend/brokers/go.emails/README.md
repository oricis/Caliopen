#### Email Broker pakage

##### Usage
* import the package  
`import broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"`
* initialize the broker with the relevant config struct  
`brokerConnectors, err = broker.Initialize(config)`

`config` is type `broker.LDAconfig` :  

```
type (
	LDAConfig struct {
		BrokerType       string      `mapstructure:"broker_type"`
		NatsURL          string      `mapstructure:"nats_url"`
		StoreName        string      `mapstructure:"store_name"`
		StoreConfig      StoreConfig `mapstructure:"store_settings"`
		IndexName        string      `mapstructure:"index_name"`
		IndexConfig      IndexConfig `mapstructure:"index_settings"`
		InTopic          string      `mapstructure:"in_topic"`
		InWorkers        int         `mapstructure:"lda_workers_size"`
		LogReceivedMails bool        `mapstructure:"log_received_mails"`
		OutTopic         string      `mapstructure:"out_topic"`
		NatsListeners    int         `mapstructure:"nats_listeners"`
		AppVersion       string
	}

	StoreConfig struct {
		Hosts       []string `mapstructure:"hosts"`
		Keyspace    string   `mapstructure:"keyspace"`
		Consistency uint16   `mapstructure:"consistency_level"`
	}
	IndexConfig struct {
		Urls []string `mapstructure:"urls"`
	}
)
```

`broker.Initialize()` will start a broker that :

* listen to Caliopen's NATS (outgoing messages)
* listen to inbound channel from the smtp agent (ingoing emails)

The broker returns 2 channels to communicate with the smtp agent :

* `IncomingSmtp` for the smtp agent to inject inbound emails into Caliopen.
* `OutcomingSmtp` for the smtp agent to receive outbound emails from Caliopen and deliver them.
 
These channels deal with an `SmtpEmail` struct :  

```
	SmtpEmail struct {
		EmailMessage *EmailMessage
		Response     chan *DeliveryAck
	}
```
which is made of :
```
	
    // EmailMessage is a wrapper to handle the relationship
    // between an email representation and its Caliopen message counterpart
    EmailMessage struct {
        Email   *Email
        Message *obj.MessageModel
    }

    Email struct {
        SmtpMailFrom string       // from or for the smtp agent
        SmtpRcpTo    []string     // from or for the smtp agent
        Raw          bytes.Buffer // raw email (without the Bcc header)
    }
```


##### Example
* Inject an email into Caliopen from the smtp agent : (errors handling and config retreiving skipped for brevity)

```
import broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"

func main() {
    var brokerConnectors broker.EmailBrokerConnectors
    brokerConnectors, err = broker.Initialize(config)
    emailMessage := broker.EmailMessage{
    		Email: &broker.Email{
    			SmtpMailFrom: from,  // sender email as a string
    			SmtpRcpTo:    to,   // recipients list as a []string
    			Raw:          raw_email, // incoming email as a byte.buffer
    		},
    		Message: nil,
    	}
    	incoming := &broker.SmtpEmail{
    		EmailMessage: &emailMessage,
    		Response:     make(chan *broker.DeliveryAck),
    	}
    	defer close(incoming.Response)
    
    	brokerConnectors.IncomingSmtp <- incoming
    
    	select {
    	case response := <-incoming.Response:
    		if response.Err != nil {
    			return NewSmtpResponse(fmt.Sprintf("554 Error : " + response.Err.Error()))
    		} else {
    			return NewSmtpResponse("250 OK: message(s) delivered.")
    		}
    	case <-time.After(30 * time.Second):
    		return NewSmtpResponse("554 Error: LDA timeout")
    	}
}
```

