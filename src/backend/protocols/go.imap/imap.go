/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"bytes"
	"crypto/tls"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-imap"
	"github.com/emersion/go-imap/client"
	"strconv"
	"strings"
	"time"
)

// ImapFetcherHeaders are headers added to emails fetched from remote IMAP
type ImapFetcherHeaders map[string]string

func imapLogin(rId *RemoteIdentity) (tlsConn *tls.Conn, imapClient *client.Client, err error) {
	log.Println("Connecting to server...")
	// Dial TLS directly to be able to dump tls connection state
	tlsConn, err = tls.Dial("tcp", rId.Infos["server"], nil)
	if err != nil {
		log.WithError(err).Error("[fetchMail] imapLogin failed to dial tls")
		return
	}
	imapClient, err = client.New(tlsConn)
	if err != nil {
		log.WithError(err).Error("[fetchMail] imapLogin failed to create IMAP client")
		return
	}
	log.Println("Connected")

	// Login
	if err = imapClient.Login(rId.Infos["username"], rId.Infos["password"]); err != nil {
		log.WithError(err).Error("[fetchMail] imapLogin failed to login IMAP")
		return
	}
	log.Println("Logged in")

	return
}

// syncMailbox will check uidvalidity and fetch only new messages since last sync state saved in RemoteIdentity.
// If no previous state found in RemoteIdentity or uidvalidity has changed, syncMailbox will do a full fetch instead.
func syncMailbox(ibox imapBox, imapClient *client.Client, rId *RemoteIdentity, ch chan *imap.Message) (err error) {

	mbox, err := imapClient.Select(ibox.name, false)
	if err != nil {
		log.WithError(err).Error("[fetchMail] failed to select INBOX")
		return
	}

	// check mailbox UIDVALIDITY
	lastUIDVALIDITY, _ := strconv.Atoi(ibox.uidValidity)
	if mbox.UidValidity != uint32(lastUIDVALIDITY) {
		// TODO
		// MUST empty the local cache of that mailbox and resync mailbox
	}

	// discover new messages

	// retrieve new messages
	from := uint32(1)
	to := mbox.Messages
	if mbox.Messages > 10 {
		// We're using unsigned integers here, only substract if the result is > 0
		from = mbox.Messages - 10
	}
	seqset := new(imap.SeqSet)
	seqset.AddRange(from, to)

	done := make(chan error, 1)
	//TODO : manage closing
	// TODO: check for capabilities before fetching to look for IMAP specific extensions, like X-GM-EXT-1 for gmail
	items := []imap.FetchItem{imap.FetchFlags, imap.FetchUid, "BODY.PEEK[]", "X-GM-LABELS"}

	go func() {
		imapClient.Fetch(seqset, items, ch)
	}()

	if err = <-done; err != nil {
		log.WithError(err).Errorf("[fetchMails] failed")
		return err
	}

	return nil
}

// fetchMailbox retrieves all messages found within remote mailbox
func fetchMailbox(ibox *imapBox, imapClient *client.Client, ch chan *imap.Message) (err error) {

	mbox, err := imapClient.Select(ibox.name, true)
	if err != nil {
		log.WithError(err).Error("[fetchMail] failed to select INBOX")
		return
	}

	from := uint32(1)
	to := mbox.Messages

	seqset := new(imap.SeqSet)
	seqset.AddRange(from, to)

	log.Infof("begining to fetch %d messages.", to-from)
	done := make(chan error, 1)
	//TODO : manage closing
	// TODO: check for capabilities before fetching to look for IMAP specific extensions, like X-GM-EXT-1 for gmail
	items := []imap.FetchItem{imap.FetchFlags, imap.FetchUid, "BODY.PEEK[]", "X-GM-LABELS"}

	go func() {
		imapClient.Fetch(seqset, items, ch)
	}()

	if err = <-done; err != nil {
		log.WithError(err).Errorf("[fetchMails] failed")
		return err
	}

	return nil

	return
}

// MashalImap build RFC5322 mail from imap.Message and add `X-Fetched` headers.
// Returns an Email suitable to send to our email lda.
func MarshalImap(message *imap.Message, xHeaders ImapFetcherHeaders) (mail *Email, err error) {

	var mailBuff bytes.Buffer

	xHeaders["X-Fetched-Imap-Uid"] = strconv.Itoa(int(message.Uid))
	xHeaders["X-Fetched-Imap-Flags"] = strings.Join(message.Flags, "\r    ")

	for k, v := range xHeaders {
		mailBuff.WriteString(k + ": " + v + "\r")
	}

	for _, body := range message.Body { // should have only one body
		_, err := mailBuff.ReadFrom(body)
		if err != nil {
			//TODO
		}
		// stop at first iteration because only one body
		break
	}

	mail = &Email{
		Raw: mailBuff,
	}
	return
}

// buildXheaders builds handshake string to put in X-Fetched header
func buildXheaders(tlsConn *tls.Conn, imapClient *client.Client, rId *RemoteIdentity, box *imapBox) (xHeaders ImapFetcherHeaders) {
	connState := tlsConn.ConnectionState()
	capabilities, _ := imapClient.Capability()
	var proto string
	if capabilities["IMAP4rev1"] == true {
		proto = "with IMAP4rev1 protocol"
	}
	xHeaders = make(ImapFetcherHeaders)
	xHeaders["X-Fetched-Imap"] = fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`,
		rId.Infos["server"],
		tlsConn.RemoteAddr().String(),
		TlsVersions[connState.Version],
		TlsSuites[connState.CipherSuite],
		proto,
		time.Now().Format(time.RFC1123Z))

	xHeaders["X-Fetched-Imap-Account"] = rId.Identifier
	xHeaders["X-Fetched-Imap-Box"] = box.name
	xHeaders["X-Fetched-Imap-For"] = rId.UserId.String()

	return
}
