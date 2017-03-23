// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package caliopen_smtp

import (
	"bytes"
	"fmt"
	broker "github.com/CaliOpen/CaliOpen/src/backend/brokers/go.emails"
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
	"github.com/flashmob/go-guerrilla"
	"strconv"
	"strings"
	"time"
)

// BackendResult represents a response to an SMTP client after receiving DATA.
// It's a clone of guerrilla BackendResult interface
type InboundSMTPResponse interface {
	fmt.Stringer
	// Code should return the SMTP code associated with this response, ie. `250`
	Code() int
}

// guerrilla backend interface implementation
// Process is called within a goroutine. Must be concurrent safe.
func (server *SMTPServer) Process(ev *guerrilla.Envelope) guerrilla.BackendResult {
	var raw_email bytes.Buffer
	raw_email.WriteString(ev.Data)
	var to []string
	for _, email_add := range ev.RcptTo {
		to = append(to, email_add.String())
	}

	emailMessage := broker.EmailMessage{
		Email: &broker.Email{
			SmtpMailFrom: []string{ev.MailFrom.String()},
			SmtpRcpTo:    to,
			Raw:          raw_email,
		},
		Message: &objects.Message{},
	}
	incoming := &broker.SmtpEmail{
		EmailMessage: &emailMessage,
		Response:     make(chan *broker.DeliveryAck),
	}
	defer close(incoming.Response)

	server.brokerConnectors.IncomingSmtp <- incoming

	select {
	case response := <-incoming.Response:
		if response.Err != nil {
			return NewInboundResponse(fmt.Sprintf("554 Error : " + response.Err.Error()))
		} else {
			return NewInboundResponse("250 OK: message(s) delivered.")
		}
	case <-time.After(30 * time.Second):
		return NewInboundResponse("554 Error: LDA timeout")
	}
}

func NewInboundResponse(message string) InboundSMTPResponse {
	return inboundResponse(message)
}

// Internal implementation of guerrilla BackendResult.
type inboundResponse string

func (res inboundResponse) String() string {
	return string(res)
}

// Parses the SMTP code from the first 3 characters of the SMTP message.
// Returns 554 if code cannot be parsed.
func (res inboundResponse) Code() int {
	trimmed := strings.TrimSpace(string(res))
	if len(trimmed) < 3 {
		return 554
	}
	code, err := strconv.Atoi(trimmed[:3])
	if err != nil {
		return 554
	}
	return code
}
