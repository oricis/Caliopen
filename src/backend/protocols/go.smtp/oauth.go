package caliopen_smtp

import (
	"encoding/json"
	"fmt"
	"net/smtp"
)

// The XOAUTH2 mechanism name.
const Xoauth2 = "XOAUTH2"

// An XOAUTH2 error.
type Xoauth2Error struct {
	Status  string `json:"status"`
	Schemes string `json:"schemes"`
	Scope   string `json:"scope"`
}

// Implements error.
func (err *Xoauth2Error) Error() string {
	return fmt.Sprintf("XOAUTH2 authentication error (%v)", err.Status)
}

// XOAuth2 is the smtp.Auth interface that implements the XOauth2 authentication mechanism.
type XOAuth2 struct {
	username string
	token    string
	host     string
}

func (a *XOAuth2) Start(server *smtp.ServerInfo) (string, []byte, error) {
	return Xoauth2, []byte("user=" + a.username + "\x01auth=Bearer " + a.token + "\x01\x01"), nil
}

func (a *XOAuth2) Next(fromServer []byte, more bool) ([]byte, error) {
	// Server sent an error response
	xoauth2Err := &Xoauth2Error{}
	if err := json.Unmarshal(fromServer, xoauth2Err); err != nil {
		return nil, err
	} else {
		return nil, xoauth2Err
	}
}
