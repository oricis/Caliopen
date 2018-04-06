/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-imap"
	"github.com/satori/go.uuid"
	"strconv"
	"time"
)

type Fetcher struct {
	Store backends.IdentityStorage
	Lda   *Lda
}

type imapBox struct {
	lastSeenUid uint32
	lastSync    time.Time
	name        string
	uidValidity uint32
}

// FetchSyncRemote retrieves remote identity credentials and last sync data,
// connects to remote IMAP server to fetch new mails,
// adds X-Fetched-Imap headers before forwarding mails to lda,
// updates last sync data for identity in db.
func (f *Fetcher) SyncRemoteWithLocal(order IMAPfetchOrder) error {

	log.Infof("[Fetcher] will fetch mails from %s", order.Identifier)

	// 1. retrieve infos from db
	rId, err := f.Store.RetrieveRemoteIdentity(order.UserId, order.Identifier)
	if err != nil {
		log.WithError(err).Infof("[SyncRemoteWithLocal] failed to retrieve remote identity <%s> : <%s>", order.UserId, order.Identifier)
		return err
	}
	if order.Password != "" {
		rId.Infos["password"] = order.Password
	}
	// 2. sync/fetch with remote IMAP
	mails := make(chan *Email)
	lastsync := time.Time{}
	if rId.Infos["lastsync"] != "" {
		lastsync, err = time.Parse(time.RFC3339, rId.Infos["lastsync"])
		if err != nil {
			log.WithError(err).Warnf("[syncMails] failed to parse lastsync string <%s>", rId.Infos["lastsync"])
			lastsync = time.Time{}
		}
	}
	// Sync INBOX (only INBOX for now)
	// TODO : sync other mailbox(es) from rId.Infos params
	lastseenuid, err := strconv.Atoi(rId.Infos["lastseenuid"])
	if err != nil {
		log.WithError(err).Warn("[SyncRemoteWithLocal] failed to get lastseenuid")
	}
	uidvalidity, err := strconv.Atoi(rId.Infos["uidvalidity"])
	if err != nil {
		log.WithError(err).Warn("[SyncRemoteWithLocal] failed to get uidvalidity")
	}
	box := imapBox{
		lastSeenUid: uint32(lastseenuid),
		lastSync:    lastsync,
		name:        "INBOX",
		uidValidity: uint32(uidvalidity),
	}
	go f.syncMails(rId, &box, mails)
	//TODO errors handling

	// 3. forward mails to lda
	errs := []error{}
	for mail := range mails {
		if box.lastSeenUid == mail.ImapUid {
			// do not forward last seen message, we already have it
			continue
		}
		err := f.Lda.deliverMail(mail, order.UserId)
		errs = append(errs, err)
		if err == nil {
			box.lastSeenUid = mail.ImapUid
		}
	}

	for i, err := range errs {
		// TODO: improve error handling protocol
		if err != nil {
			log.WithError(err).Warnf("[Fetcher] SyncRemoteWithLocal error delivering mail #%d", i)
		}
	}

	// 4. backup sync state in db
	rId.LastCheck = time.Now()
	rId.Infos["uidvalidity"] = strconv.Itoa(int(box.uidValidity))
	rId.Infos["lastsync"] = rId.LastCheck.Format(time.RFC3339)
	rId.Infos["lastseenuid"] = strconv.Itoa(int(box.lastSeenUid))
	fields := map[string]interface{}{
		"LastCheck": rId.LastCheck,
		"Infos":     rId.Infos,
	}
	err = f.Store.UpdateRemoteIdentity(rId, fields)
	if err != nil {
		log.WithError(err).Warnf("[syncMails] failed to backup sync state")
		return err
	}

	log.Infof("[Fetcher] all done for %s : %d new mail(s) fetched", order.Identifier, len(errs))
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
		lastSync: time.Time{},
		name:     order.Mailbox,
	}

	// 2. fetch remote messages
	mails := make(chan *Email, 10)
	go f.fetchMails(&rId, &box, mails)
	//TODO errors handling

	// 3. forward mails to lda
	errs := make([]error, len(mails))
	for mail := range mails {
		err := f.Lda.deliverMail(mail, order.UserId)
		errs = append(errs, err)
	}

	return nil
}

// fetchMails fetches all messages from remote mailbox and returns well-formed Emails for lda.
func (f *Fetcher) fetchMails(rId *RemoteIdentity, box *imapBox, ch chan *Email) (err error) {

	tlsConn, imapClient, provider, err := imapLogin(rId)
	// Don't forget to logout and close chan
	defer func() {
		imapClient.Logout()
		log.Println("Logged out")
		close(ch)
	}()
	if err != nil {
		return err
	}

	newMessages := make(chan *imap.Message, 10)
	go fetchMailbox(box, imapClient, provider, newMessages) //TODO : errors handling
	for msg := range newMessages {
		mail, err := MarshalImap(msg, buildXheaders(tlsConn, imapClient, rId, box, msg, provider))
		if err != nil {
			//todo
			continue
		}
		ch <- mail
	}

	close(newMessages)
	return
}

// fetchSyncMails reads last sync state for remote identity,
// fetches new messages accordingly, and returns well-formed Emails for lda.
func (f *Fetcher) syncMails(rId *RemoteIdentity, box *imapBox, ch chan *Email) (err error) {

	tlsConn, imapClient, provider, err := imapLogin(rId)
	if err != nil {
		return err
	}
	// Don't forget to logout and close chan
	defer func() {
		imapClient.Logout()
		close(ch)
		log.Println("Logged out")
	}()

	newMessages := make(chan *imap.Message, 10)
	//TODO : manage closing
	go syncMailbox(box, imapClient, provider, newMessages) //TODO : errors handling

	// read new messages coming from imap chan and write to lda chan
	for msg := range newMessages {
		xHeaders := buildXheaders(tlsConn, imapClient, rId, box, msg, provider)
		mail, err := MarshalImap(msg, xHeaders)
		if err != nil {
			//todo
			continue
		} else {
			ch <- mail
		}
	}
	return
}
