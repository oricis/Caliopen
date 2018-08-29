/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"errors"
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

const (
	lastErrorKey      = "lastFetchError"
	dateFirstErrorKey = "firstErrorDate"
	dateLastErrorKey  = "lastErrorDate"
	errorsCountKey    = "errorsCount"
)

// FetchSyncRemote retrieves remote identity credentials and last sync data,
// connects to remote IMAP server to fetch new mails,
// adds X-Fetched-Imap headers before forwarding mails to lda,
// updates last sync data for identity in db.
func (f *Fetcher) SyncRemoteWithLocal(order IMAPorder) error {

	log.Infof("[Fetcher] will fetch mails for remote %s", order.RemoteId)

	// 1. retrieve infos from db
	userId, err := f.Store.RetrieveUserIdentity(order.UserId, order.RemoteId, true)
	if err != nil {
		log.WithError(err).Infof("[SyncRemoteWithLocal] failed to retrieve remote identity <%s> : <%s>", order.UserId, order.RemoteId)
		return err
	}
	if order.Password != "" {
		(*userId.Credentials)["inpassword"] = order.Password
	}

	// 1.2 check if a sync process is running
	if syncing, ok := userId.Infos["syncing"]; ok {
		startDate, _ := time.Parse(time.RFC3339, syncing)
		if time.Since(startDate)/time.Hour < failuresThreshold {
			log.Infof("[SyncRemoteWithLocal] avoiding concurrent sync for <%s>. Syncing in progress since %s", order.RemoteId, userId.Infos["syncing"])
			return nil
		}
	}
	// save syncing state in db to prevent concurrent sync
	(*userId).Infos["syncing"] = time.Now().Format(time.RFC3339)
	f.Store.UpdateUserIdentity(userId, map[string]interface{}{
		"Infos": userId.Infos,
	})

	// 2. sync/fetch with remote IMAP
	mails := make(chan *Email)
	lastsync := time.Time{}
	if userId.Infos["lastsync"] != "" {
		lastsync, err = time.Parse(time.RFC3339, userId.Infos["lastsync"])
		if err != nil {
			log.WithError(err).Warnf("[syncMails] failed to parse lastsync string <%s>", userId.Infos["lastsync"])
			lastsync = time.Time{}
		}
	}
	// Sync INBOX (only INBOX for now)
	// TODO : sync other mailbox(es) from userId.Infos params or from order
	lastseenuid, err := strconv.Atoi(userId.Infos["lastseenuid"])
	if err != nil {
		log.WithError(err).Warn("[SyncRemoteWithLocal] failed to get lastseenuid")
	}
	uidvalidity, err := strconv.Atoi(userId.Infos["uidvalidity"])
	if err != nil {
		log.WithError(err).Warn("[SyncRemoteWithLocal] failed to get uidvalidity")
	}
	box := imapBox{
		lastSeenUid: uint32(lastseenuid),
		lastSync:    lastsync,
		name:        "INBOX",
		uidValidity: uint32(uidvalidity),
	}
	go f.syncMails(userId, &box, mails)

	// 3. forward mails to lda as they come on mails chan
	errs := []error{}
	syncTimeout := time.Now()
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
		if time.Since(syncTimeout)/time.Hour > failuresThreshold {
			errs = append(errs, errors.New("[Fetcher] sync timeout, aborting for "+order.RemoteId))
			close(mails)
			break
		}
	}

	for i, err := range errs {
		// TODO: improve error handling protocol
		if err != nil {
			log.WithError(err).Warnf("[Fetcher] SyncRemoteWithLocal error delivering mail #%d", i)
		}
	}

	// 4. backup sync state in db
	var fields map[string]interface{}
	delete((*userId).Infos, "syncing")
	if _, ok := userId.Infos[errorsCountKey]; ok {
		// if this key is in Infos then imap connection failed
		// do not update LastCheck time
		fields = map[string]interface{}{
			"Infos": userId.Infos,
		}
	} else {
		userId.LastCheck = time.Now()
		userId.Infos["uidvalidity"] = strconv.Itoa(int(box.uidValidity))
		userId.Infos["lastsync"] = userId.LastCheck.Format(time.RFC3339)
		userId.Infos["lastseenuid"] = strconv.Itoa(int(box.lastSeenUid))
		fields = map[string]interface{}{
			"LastCheck": userId.LastCheck,
			"Infos":     userId.Infos,
		}
	}
	err = f.Store.UpdateUserIdentity(userId, fields)
	if err != nil {
		log.WithError(err).Warnf("[syncMails] failed to backup sync state")
		return err
	}

	log.Infof("[Fetcher] all done for %s : %d new mail(s) fetched", order.RemoteId, len(errs))
	return nil
}

// FetchRemoteToLocal blindly fetches all mails from remote without retrieving/saving any state in UserIdentity
func (f *Fetcher) FetchRemoteToLocal(order IMAPorder) error {
	userId := UserIdentity{
		UserId: UUID(uuid.FromStringOrNil(order.UserId)),
		Infos: map[string]string{
			"inserver": order.Server,
		},
		Credentials: &Credentials{
			"inusername": order.Login,
			"inpassword": order.Password,
		},
	}

	box := imapBox{
		lastSync: time.Time{},
		name:     order.Mailbox,
	}

	// 2. fetch remote messages
	mails := make(chan *Email, 10)
	go f.fetchMails(&userId, &box, mails)
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
func (f *Fetcher) fetchMails(userId *UserIdentity, box *imapBox, ch chan *Email) (err error) {
	tlsConn, imapClient, provider, err := imapLogin(userId)
	// Don't forget to logout and close chan
	defer func() {
		imapClient.Logout()
		log.Println("Logged out")
		close(ch)
	}()
	if err != nil {
		return f.handleFetchFailure(userId, WrapCaliopenErr(err, WrongCredentialsErr, "imapLogin failure"))
	} else {
		delete((*userId).Infos, lastErrorKey)
		delete((*userId).Infos, errorsCountKey)
		delete((*userId).Infos, dateFirstErrorKey)
		delete((*userId).Infos, dateLastErrorKey)
	}

	newMessages := make(chan *imap.Message, 10)
	go fetchMailbox(box, imapClient, provider, newMessages) //TODO : errors handling
	for msg := range newMessages {
		mail, err := MarshalImap(msg, buildXheaders(tlsConn, imapClient, userId, box, msg, provider))
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
func (f *Fetcher) syncMails(userId *UserIdentity, box *imapBox, ch chan *Email) (err error) {

	// Don't forget to close chan before leaving
	defer close(ch)
	tlsConn, imapClient, provider, err := imapLogin(userId)
	if err != nil {
		return f.handleFetchFailure(userId, WrapCaliopenErr(err, WrongCredentialsErr, "imapLogin failure"))
	} else {
		delete((*userId).Infos, lastErrorKey)
		delete((*userId).Infos, errorsCountKey)
		delete((*userId).Infos, dateFirstErrorKey)
		delete((*userId).Infos, dateLastErrorKey)
	}
	// Don't forget to logout
	defer func() {
		imapClient.Logout()
		log.Println("Logged out")
	}()

	newMessages := make(chan *imap.Message, 10)
	//TODO : manage closing
	go syncMailbox(box, imapClient, provider, newMessages) //TODO : errors handling

	// read new messages coming from imap chan and write to lda chan
	for msg := range newMessages {
		xHeaders := buildXheaders(tlsConn, imapClient, userId, box, msg, provider)
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

// handleFetchFailure logs a warn and save failure log in db.
// If failures reach failuresThreshold, remote id is disabled and a new notification is emitted.
func (f *Fetcher) handleFetchFailure(userId *UserIdentity, err CaliopenError) error {

	// ensure errors data fields are present
	if _, ok := userId.Infos[lastErrorKey]; !ok {
		(*userId).Infos[lastErrorKey] = ""
	}
	if _, ok := userId.Infos[dateFirstErrorKey]; !ok {
		(*userId).Infos[dateFirstErrorKey] = ""
	}
	if _, ok := userId.Infos[dateLastErrorKey]; !ok {
		(*userId).Infos[dateLastErrorKey] = ""
	}
	if _, ok := userId.Infos[errorsCountKey]; !ok {
		(*userId).Infos[errorsCountKey] = "0"
	}

	// log last error
	(*userId).Infos[lastErrorKey] = "imap connection failed : " + err.Cause().Error()
	// increment counter
	count, _ := strconv.Atoi(userId.Infos[errorsCountKey])
	count++
	(*userId).Infos[errorsCountKey] = strconv.Itoa(count)

	// update dates
	lastDate := time.Now()
	var firstDate time.Time
	firstDate, _ = time.Parse(time.RFC3339, userId.Infos[dateFirstErrorKey])
	if firstDate.IsZero() {
		firstDate = lastDate
	}
	(*userId).Infos[dateFirstErrorKey] = firstDate.Format(time.RFC3339)
	(*userId).Infos[dateLastErrorKey] = lastDate.Format(time.RFC3339)

	// check failuresThreshold
	if lastDate.Sub(firstDate)/time.Hour > failuresThreshold {
		f.disableRemoteIdentity(userId)
	}

	// unlock sync state
	delete((*userId).Infos, "syncing")

	// udpate UserIdentity in db
	return f.Store.UpdateUserIdentity(userId, map[string]interface{}{
		"Infos": userId.Infos,
	})

}

func (f *Fetcher) disableRemoteIdentity(userId *UserIdentity) {
	(*userId).Status = "inactive"
	f.Store.UpdateUserIdentity(userId, map[string]interface{}{
		"Status": "inactive",
	})
	f.emitNotification()
}

func (f Fetcher) emitNotification() {
	//TODO
}
