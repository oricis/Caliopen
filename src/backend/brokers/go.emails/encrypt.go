// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// package email_broker handles codec/decodec between external emails and Caliopen message format
package email_broker

import (
	"bytes"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-message"
	"math/rand"
	"strings"
	"time"
)

var boundaryChars = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+:=?")

func randomString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = boundaryChars[rand.Intn(len(boundaryChars))]
	}
	return string(b)
}

// NewBoundary return a mail boundary according to RFC 1341 (7.2.1).
//
// boundary := 0*69<bchars> bcharsnospace
// bchars := bcharsnospace / " "
// bcharsnospace :=    DIGIT / ALPHA / "'" / "(" / ")" / "+"  / "_"
//                / "," / "-" / "." / "/" / ":" / "=" / "?"
func (b *EmailBroker) NewBoundary() string {
	return randomString(42)
}

// MarshalEncryptedEmail build an encrypted PGP/MIME email according to RFC 3156.
func (b *EmailBroker) MarshalPGPEmail(msg *Message, em *EmailMessage, addresses map[string][]string) (err error) {

	mainHeader := make(message.Header)
	params := map[string]string{"boundary": b.NewBoundary(), "protocol": "application/pgp-encrypted"}
	mainHeader.Set("Subject", msg.Subject)
	mainHeader.Set("Date", time.Now().Format(time.RFC1123Z))
	mainHeader.SetContentType("multipart/encrypted", params)
	mainHeader.Set("X-Mailer", "Caliopen-"+b.Config.AppVersion)

	for field, addrs := range addresses {
		if len(addrs) > 0 {
			mainHeader.Set(field, strings.Join(addrs, ","))
		}
	}

	// References headers
	mainHeader.Set("Message-ID", "<"+b.NewMessageId(em.Message.Message_id.Bytes())+">")

	// Formatted multipart body
	body, err := formatBody(msg, mainHeader)
	if err != nil {
		return err
	}
	em.Email.Raw = body
	log.Debug("Raw encrypted mail", em.Email.Raw)

	json_rep, _ := EmailToJsonRep(em.Email.Raw.String())
	em.Email_json = &json_rep
	return
}

func formatBody(msg *Message, mainHeader message.Header) (bytes.Buffer, error) {
	// Create part to include into multipart/[encrypted/signed]
	var body bytes.Buffer
	part1 := make(message.Header)
	part1.SetContentType("application/pgp-encrypted", nil)
	part1.SetContentDescription("PGP/MIME version identification")
	part1Body := bytes.NewBuffer([]byte("Version: 1\n"))

	part2 := make(message.Header)
	part2Params := map[string]string{"name": "encrypted.asc"}
	dispoParams := map[string]string{"filename": "encrypted.asc"}

	part2.SetContentType("application/octet-stream", part2Params)
	part2.SetContentDescription("Caliopen PGP encrypted message")
	part2.SetContentDisposition("inline", dispoParams)
	part2Body := bytes.NewBuffer([]byte(msg.Body_plain))

	entityVersion := &message.Entity{Header: part1, Body: part1Body}
	entityBody := &message.Entity{Header: part2, Body: part2Body}

	entities := []*message.Entity{entityVersion, entityBody}

	mp, err := message.NewMultipart(mainHeader, entities)
	if err != nil {
		return body, err
	}

	err = mp.WriteTo(&body)
	if err != nil {
		return body, err
	}
	return body, nil
}
