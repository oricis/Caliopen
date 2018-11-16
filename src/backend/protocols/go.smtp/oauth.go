package caliopen_smtp

import (
	"encoding/json"
	"fmt"
	"net/smtp"
)

// The XOAUTH2 mechanism name.
const Xoauth2 = "XOAUTH2"

// An XOAUTH2 error.
type Xoauth2Response struct {
	Status  string `json:"status"`
	Schemes string `json:"schemes"`
	Scope   string `json:"scope"`
}

// Implements error.
func (err *Xoauth2Response) Error() string {
	return fmt.Sprintf("XOAUTH2 authentication error (%v)", err.Status)
}

// xoauth2Client is the smtp.Auth interface that implements the XOauth2 authentication mechanism.
type Xoauth2Client struct {
	Username string
	Token    string
}

func (a *Xoauth2Client) Start(server *smtp.ServerInfo) (string, []byte, error) {
	return Xoauth2, []byte("user=" + a.Username + "\x01auth=Bearer " + a.Token + "\x01\x01"), nil
}

func (a *Xoauth2Client) Next(fromServer []byte, more bool) ([]byte, error) {
	if more {
		xoauth2Err := &Xoauth2Response{}
		if err := json.Unmarshal(fromServer, xoauth2Err); err != nil {
			return nil, err
		} else {
			return nil, xoauth2Err
		}
	}
	return nil, nil
}
