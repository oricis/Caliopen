/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-imap"
	"github.com/satori/go.uuid"
	"time"
)

type Fetcher struct {
	Store *store.CassandraBackend
	Lda   *Lda
}

type imapBox struct {
	lastSeenUid string
	lastSync    time.Time
	name        string
	uidValidity string
}

// FetchSyncRemote retrieves remote identity credentials and last sync data,
// connects to remote IMAP server to fetch new mails,
// adds X-Fetched-Imap headers before forwarding mails to lda,
// updates last sync data for identity in db.
func (f *Fetcher) SyncRemoteWithLocal(order IMAPfetchOrder) error {

	log.Infof("[Fetcher] will fetch mails from %s", order.RemoteId)

	// 1. retrieve infos from db
	//TODO
	rId := RemoteIdentity{
		"stan",
		"stan.sabatier@gmail.com",
		make(map[string]string),
		time.Time{},
		"active",
		"imap",
		UUID(uuid.FromStringOrNil("2b68fc50-f6e2-4c3a-b81c-50c5a3de594e")),
	}
	rId.Infos["lastseenuid"] = ""
	rId.Infos["lastsync"] = ""
	rId.Infos["password"] = "" // TODO : REMOVE BEFORE COMMIT
	rId.Infos["server"] = "imap.gmail.com:993"
	rId.Infos["uidvalidity"] = ""
	rId.Infos["username"] = rId.Identifier

	// 2. sync/fetch with remote IMAP
	mails := make(chan *Email, 10)
	// TODO : manage closing
	go f.syncMails(&rId, mails)
	//TODO errors handling

	// 3. forward mails to lda
	errs := make([]error, len(mails))
	// TODO : manage closing
	for mail := range mails {
		err := f.Lda.deliverMail(mail, order.UserId)
		errs = append(errs, err)
	}

	// 4. backup sync state in db
	for i, err := range errs {
		// check if errors occurred and stop sync state at first error encountered
		// TODO: improve this error handling protocol
		if err != nil {
			return fmt.Errorf("[Fetcher] syncRemoteWithLocal error delivering mail #%d : %s", i, err.Error())
		}
	}

	return nil
}

func (f *Fetcher) FetchRemoteToLocal(order IMAPfetchOrder) error {
	rId := RemoteIdentity{
		Identifier: order.Login,
		UserId:     UUID(uuid.FromStringOrNil(order.UserId)),
		Infos: map[string]string{
			"server":   order.Server,
			"username": order.Login,
			"password": order.Password,
		},
	}

	box := imapBox{
		lastSeenUid: "",
		lastSync:    time.Time{},
		name:        order.Mailbox,
		uidValidity: "",
	}

	// 2. fetch remote messages
	mails := make(chan *Email, 10)
	// TODO : manage closing
	go f.fetchMails(&rId, &box, mails)
	//TODO errors handling

	// 3. forward mails to lda
	errs := make([]error, len(mails))
	// TODO : manage closing
	for mail := range mails {
		err := f.Lda.deliverMail(mail, order.UserId)
		errs = append(errs, err)
	}

	return nil
}

// fetchMails fetches all messages from remote mailbox and returns well-formed Emails for lda.
func (f *Fetcher) fetchMails(rId *RemoteIdentity, box *imapBox, ch chan *Email) (err error) {

	tlsConn, imapClient, err := imapLogin(rId)
	// Don't forget to logout
	defer func() {
		imapClient.Logout()
		log.Println("Logged out")
	}()
	if err != nil {
		return err
	}

	newMessages := make(chan *imap.Message, 10)
	//TODO : manage closing
	go fetchMailbox(box, imapClient, newMessages) //TODO : errors handling
	xHeaders := buildXheaders(tlsConn, imapClient, rId, box)
	for msg := range newMessages {
		mail, err := MarshalImap(msg, xHeaders)
		if err != nil {
			//todo
			continue
		}
		ch <- mail
	}

	return
}

// fetchSyncMails reads last sync state for remote identity,
// fetches new messages accordingly, and returns well-formed Emails for lda.
func (f *Fetcher) syncMails(rId *RemoteIdentity, ch chan *Email) (err error) {

	// Sync INBOX (only INBOX for now)
	// TODO : sync other mailbox(es) from rId.Infos params
	box := imapBox{
		lastSeenUid: "",
		lastSync:    time.Time{},
		name:        "INBOX",
		uidValidity: "",
	}

	tlsConn, imapClient, err := imapLogin(rId)
	// Don't forget to logout
	defer func() {
		imapClient.Logout()
		log.Println("Logged out")
	}()
	if err != nil {
		return
	}

	newMessages := make(chan *imap.Message, 10)
	//TODO : manage closing
	go syncMailbox(box, imapClient, rId, newMessages) //TODO : errors handling
	xHeaders := buildXheaders(tlsConn, imapClient, rId, &box)
	for msg := range newMessages {
		mail, err := MarshalImap(msg, xHeaders)
		if err != nil {
			//todo
			continue
		}
		ch <- mail
	}

	return
}
