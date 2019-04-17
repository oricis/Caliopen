/*
 * // Copyleft (ɔ) 2017 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package REST

import (
	"encoding/json"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	log "github.com/Sirupsen/logrus"
	"github.com/bitly/go-simplejson"
	"github.com/pkg/errors"
	"github.com/satori/go.uuid"
	"strings"
	"sync"
	"time"
)

// CreateContact validates Contact before saving it to cassandra and ES
func (rest *RESTfacility) CreateContact(contact *Contact) (err error) {
	// add missing properties
	contact.ContactId.UnmarshalBinary(uuid.NewV4().Bytes())
	contact.DateInsert = time.Now()
	contact.DateUpdate = contact.DateInsert

	// normalization
	helpers.ComputeNewTitle(contact)
	helpers.NormalizePhoneNumbers(contact)
	MarshalNested(contact)
	MarshalRelated(contact)

	// concurrent creation in db & index
	wg := new(sync.WaitGroup)
	wg.Add(2)
	errGroup := new([]string)
	mx := new(sync.Mutex)
	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.store.CreateContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.index.CreateContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	wg.Wait()
	if len(*errGroup) > 0 {
		return fmt.Errorf("%s", strings.Join(*errGroup, " / "))
	}

	// notify external components
	go func(contact *Contact) {
		const updatePI_order = "contact_update"
		natsMessage := fmt.Sprintf(Nats_contact_tmpl, updatePI_order, contact.ContactId.String(), contact.UserId.String())
		rest.PublishOnNats(natsMessage, rest.natsTopics[Nats_Contacts_topicKey])
	}(contact)

	return nil
}

// RetrieveContacts returns contacts collection from index given filter params
func (rest *RESTfacility) RetrieveContacts(filter IndexSearch) (contacts []*Contact, totalFound int64, err error) {

	contacts, totalFound, err = rest.index.FilterContacts(filter)
	if err != nil {
		return []*Contact{}, 0, err
	}

	return
}

// RetrieveContact returns one contact
func (rest *RESTfacility) RetrieveContact(userID, contactID string) (contact *Contact, err error) {
	return rest.store.RetrieveContact(userID, contactID)
}

// RetrieveUserContact returns the contact entry belonging to user.
// This is the contact that is auto-created for user and can't be deleted.
func (rest *RESTfacility) RetrieveUserContact(userID string) (contact *Contact, err error) {
	contactID := rest.store.RetrieveUserContactId(userID)
	if contactID == "" {
		return nil, NewCaliopenErrf(NotFoundCaliopenErr, "[RetrieveUserContact] didn't find contact id for user %s", userID)
	}
	contact, err = rest.store.RetrieveContact(userID, contactID)
	if err != nil {
		return nil, err
	}
	return
}

// PatchContact is a shortcut for REST api to :
// - retrieve the contact from db
// - UpdateWithPatch() with UserActor role
// - then UpdateContact() to save updated contact to stores & index if everything went good.
func (rest *RESTfacility) PatchContact(user *UserInfo, patch []byte, contactID string) error {
	// TODO : fix removing identities which fails silently on user's contact
	current_contact, err := rest.RetrieveContact(user.User_id, contactID)
	if err != nil {
		if err.Error() == "not found" {
			return NewCaliopenErr(NotFoundCaliopenErr, "[RESTfacility] contact not found")
		} else {
			return WrapCaliopenErr(err, DbCaliopenErr, "[RESTfacility] PatchContact failed to retrieve contact")
		}
	}

	// read into the patch to make basic controls before processing it with generic helper
	patchReader, err := simplejson.NewJson(patch)
	if err != nil {
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[RESTfacility] PatchContact failed with simplejson error : %s", err)
	}
	// forbid tags modification immediately
	if _, hasTagsProp := patchReader.CheckGet("tags"); hasTagsProp {
		return NewCaliopenErr(ForbiddenCaliopenErr, "[RESTfacility] PatchContact : patching tags through parent object is forbidden")
	}
	// checks "current_state" property is present
	if _, hasCurrentState := patchReader.CheckGet("current_state"); !hasCurrentState {
		return NewCaliopenErr(ForbiddenCaliopenErr, "[RESTfacility] PatchContact : current_state property must be in patch")
	}

	// patch seams OK, apply it to the resource
	var modifiedFields map[string]interface{}
	newContact, modifiedFields, err := helpers.UpdateWithPatch(patch, current_contact, UserActor)
	if err != nil {
		log.WithError(err).Warn("[RESTfacility] PatchContact failed")
		return WrapCaliopenErr(err, FailDependencyCaliopenErr, "[RESTfacility] PatchContact failed")
	}

	needNewTitle := false
	discoverKey := false

	for key := range modifiedFields {
		switch key {
		// check if title has to be re-computed
		case "AdditionalName", "FamilyName", "GivenName", "NamePrefix", "NameSuffix":
			needNewTitle = true
			// Check if we can try to discover a public key
		case "Emails", "Identities":
			discoverKey = true
		}
	}
	if needNewTitle {
		helpers.ComputeTitle(newContact.(*Contact))
		modifiedFields["Title"] = newContact.(*Contact).Title
	}

	// save updated resource
	err = rest.UpdateContact(user, newContact.(*Contact), current_contact, modifiedFields)
	if err != nil {
		return WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[RESTfacility] PatchContact failed with UpdateContact error : %s", err)
	}
	if discoverKey {
		err = rest.launchKeyDiscovery(current_contact, modifiedFields)
	}

	return nil

}

func (rest *RESTfacility) launchKeyDiscovery(current_contact *Contact, updatedFields map[string]interface{}) error {
	go func(contact *Contact) {
		const discover_order = "discover_key"
		message := DiscoverKeyMessage{Order: discover_order,
			ContactId: current_contact.ContactId.String(),
			UserId:    current_contact.UserId.String()}
		if value, ok := updatedFields["Emails"]; ok {
			message.Emails = value.([]EmailContact)
		}
		if value, ok := updatedFields["Identities"]; ok {
			message.Identities = value.([]SocialIdentity)
		}
		natsMessage, err := json.Marshal(message)
		if err != nil {
			return
		}
		log.Infof("Will publish nats topic %s for contact %s", rest.natsTopics[Nats_Keys_topicKey], current_contact.ContactId.String())
		rest.PublishOnNats(string(natsMessage), rest.natsTopics[Nats_Keys_topicKey])
	}(current_contact)
	return nil
}

// UpdateContact updates a contact in store & index with payload
func (rest *RESTfacility) UpdateContact(user *UserInfo, contact, oldContact *Contact, modifiedFields map[string]interface{}) error {

	err := rest.store.UpdateContact(contact, oldContact, modifiedFields)
	if err != nil {
		return err
	}

	err = rest.index.UpdateContact(user, contact, modifiedFields)
	if err != nil {
		return err
	}

	// notify external components
	go func(contact *Contact) {
		const update_order = "contact_update"
		natsMessage := fmt.Sprintf(Nats_contact_tmpl, update_order, contact.ContactId.String(), contact.UserId.String())
		err := rest.PublishOnNats(natsMessage, rest.natsTopics[Nats_Contacts_topicKey])
		if err != nil {
			log.WithError(err).Error("[UpdateContact] failed to publish contact_update on nats")
		}
	}(contact)

	return nil
}

// DeleteContact deletes a contact in store & index, only if :
// - contact belongs to user ;-)
// - contact is not the user's contact card
func (rest *RESTfacility) DeleteContact(userID, contactID string) error {
	user, err := rest.store.RetrieveUser(userID)
	if err != nil {
		return err
	}
	contact, err := rest.store.RetrieveContact(userID, contactID)
	if err != nil {
		return err
	}

	if user.ContactId == contact.ContactId {
		return errors.New("can't delete contact card related to user")
	}

	// parallel deletion in db & index
	wg := new(sync.WaitGroup)
	wg.Add(2)
	errGroup := new([]string)
	mx := new(sync.Mutex)
	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.store.DeleteContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	go func(wg *sync.WaitGroup, errGroup *[]string, mx *sync.Mutex) {
		err = rest.index.DeleteContact(contact)
		if err != nil {
			mx.Lock()
			*errGroup = append(*errGroup, err.Error())
			mx.Unlock()
		}
		wg.Done()
	}(wg, errGroup, mx)

	wg.Wait()
	if len(*errGroup) > 0 {
		return fmt.Errorf("%s", strings.Join(*errGroup, " / "))
	}
	return nil
}

func (rest *RESTfacility) ContactExists(userID, contactID string) bool {
	return rest.store.ContactExists(userID, contactID)
}

// addIdentityToContact updates Contact card in db and index with data from UserIdentity
// it embeds a new Email or a new SocialIdentity or a new IM depending of UserIdentity's type.
// returns new version of Contact saved in stores.
func addIdentityToContact(storeContact backends.ContactStorage, indexContact backends.ContactIndex, storeUser backends.UserStorage, identity UserIdentity, contact *Contact) (*Contact, CaliopenError) {
	// TODO : prevent duplicate
	updatedFields := map[string]interface{}{}
	newContact := *contact
	switch identity.Protocol {
	case EmailProtocol, ImapProtocol, SmtpProtocol:
		ec := new(EmailContact)
		ec.MarshallNew()
		ec.Address = identity.Identifier
		ec.Type = "other"
		if identity.DisplayName != "" {
			ec.Label = identity.DisplayName
		} else {
			ec.Label = identity.Identifier
		}
		ec.IsPrimary = false
		if contact.Emails == nil {
			newContact.Emails = []EmailContact{*ec}
		} else {
			newContact.Emails = append(contact.Emails, *ec)
		}
		updatedFields["Emails"] = newContact.Emails
	case TwitterProtocol:
		si := new(SocialIdentity)
		si.MarshallNew()
		si.Type = TwitterProtocol
		si.Name = identity.Identifier
		si.Infos = map[string]string{
			"twitterid":   identity.Infos["twitterid"],
			"screen_name": identity.Identifier,
		}
		if contact.Identities == nil {
			newContact.Identities = []SocialIdentity{*si}
		} else {
			newContact.Identities = append(contact.Identities, *si)
		}
		updatedFields["Identities"] = newContact.Identities
	default:
		return nil, NewCaliopenErrf(UnprocessableCaliopenErr, "[addIdentityToContact] unknown protocol %s for identity %s. Can't add identity to contact card.", identity.Protocol, identity.Id)
	}

	err := storeContact.UpdateContact(&newContact, contact, updatedFields)
	if err != nil {
		return nil, WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[addIdentityToContact] failed to update contact %s in store", contact.ContactId)
	}
	userShard := storeUser.GetShardForUser(identity.UserId.String())
	err = indexContact.UpdateContact(&UserInfo{identity.UserId.String(), userShard}, &newContact, updatedFields)
	if err != nil {
		return nil, WrapCaliopenErrf(err, FailDependencyCaliopenErr, "[addIdentityToContact] failed to update contact %s in index", contact.ContactId)
	}

	return &newContact, nil
}
