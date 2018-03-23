/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"crypto/tls"
	"fmt"
	broker "github.com/CaliOpen/Caliopen/src/backend/brokers/go.emails"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-imap"
	"github.com/emersion/go-imap/client"
	"github.com/satori/go.uuid"
	"strconv"
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

	log.Infof("[Fetcher] will fetch mails from %s", order.RemoteIdentity)

	// 1. retrieve infos from db
	//TODO
	rId := RemoteIdentity{
		"stan",
		"stan.sabatier@gmail.com",
		make(map[string]string),
		time.Time{},
		"active",
		"imap",
		UUID(uuid.FromStringOrNil(order.RemoteIdentity)),
	}
	rId.Infos["lastseenuid"] = ""
	rId.Infos["lastsync"] = ""
	rId.Infos["password"] = "" // TODO : REMOVE BEFORE COMMIT
	rId.Infos["server"] = "imap.gmail.com:993"
	rId.Infos["uidvalidity"] = ""
	rId.Infos["username"] = rId.Identifier

	// 2. sync/fetch with remote IMAP
	mails := make(chan *Email, 10)
	go f.fetchMails(&rId, mails)
	//TODO errors handling

	// 3. forward fetched mails to lda
	acks := make([]*broker.DeliveryAck, len(mails))
	for mail := range mails {
		ack := f.Lda.deliverMail(mail)
		acks = append(acks, ack)
	}

	// 4. backup sync state in db
	for _, ack := range acks {
		// check if errors occurred and stop sync state at first error encountered
		// TODO: improve this error handling protocol
		if ack.Err {
			break
		}
	}

	return nil
}

// fetchMails reads last sync state for remote identity,
// fetches new emails accordingly,
// adds `X-Fetched-Imap` headers to each email retrieved.
func (f *Fetcher) fetchMails(rId *RemoteIdentity, ch chan *Email) (err error) {

	log.Println("Connecting to server...")
	// Dial TLS directly to be able to dump tls connection state
	conn, err := tls.Dial("tcp", rId.Infos["server"], nil)
	if err != nil {
		log.WithError(err).Error("[fetchMail] failed to dial tls")
		return
	}
	c, err := client.New(conn)
	if err != nil {
		log.WithError(err).Error("[fetchMail] failed to create IMAP client")
		return
	}
	log.Println("Connected")

	// Login
	if err = c.Login(rId.Infos["username"], rId.Infos["password"]); err != nil {
		log.WithError(err).Error("[fetchMail] failed to login IMAP")
		return
	}
	log.Println("Logged in")
	// Don't forget to logout
	defer func() {
		c.Logout()
		log.Println("Logged out")
	}()

	// build handshake string to put in X-Fetched header
	xHeaders := make(ImapFetcherHeaders)
	connState := conn.ConnectionState()
	capability, _ := c.Capability()
	var proto string
	if capability["IMAP4rev1"] == true {
		proto = "with IMAP4rev1 protocol"
	}
	xHeaders["X-Fetched"] = fmt.Sprintf(`from %s ([%s])
    (using %s with cipher %s)
	by imap-fetcher (Caliopen) %s;
	%s`,
		rId.Infos["server"],
		conn.RemoteAddr().String(),
		TlsVersions[connState.Version],
		TlsSuites[connState.CipherSuite],
		proto,
		time.Now().Format(time.RFC1123Z))

	// Sync INBOX (only INBOX for now)
	// TODO : sync other mailbox(es) from rId.Infos params
	inbox := imapBox{
		lastSeenUid: "",
		lastSync:    time.Time{},
		name:        "INBOX",
		uidValidity: "",
	}
	newMessages := make(chan *imap.Message, 10)
	go syncMailbox(inbox, c, newMessages)
	//TODO : errors handling
	for msg := range newMessages {
		// add `X-Fetched` headers and build RFC5322 mails
		mail, err := MarshalImap(msg, xHeaders)
		if err != nil {
			//todo
			continue
		}
		ch <- mail
	}

	return
}

func syncMailbox(ibox imapBox, c *client.Client, ch chan *imap.Message) (err error) {

	mbox, err := c.Select(ibox.name, false)
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

	// Get the last 3 messages

	from := uint32(1)
	to := mbox.Messages
	if mbox.Messages > 2 {
		// We're using unsigned integers here, only substract if the result is > 0
		from = mbox.Messages - 2
	}
	seqset := new(imap.SeqSet)
	seqset.AddRange(from, to)

	done := make(chan error, 1)
	section := &imap.BodySectionName{} // get a pointer to a BodySectionName to easier body retrieving
	items := []imap.FetchItem{imap.FetchFlags, imap.FetchInternalDate, imap.FetchRFC822Size, section.FetchItem()}

	go func() {
		log.Info("begin fetching")
		c.Fetch(seqset, items, ch)
		log.Info("end fetching")
	}()

	if err = <-done; err != nil {
		log.WithError(err).Errorf("[fetchMails] failed")
		return err
	}

	return nil
}
