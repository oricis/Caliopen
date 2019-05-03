package objects

import (
	"bytes"
	"encoding/json"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"sort"
	"sync"
	"time"
)

type (
	Contact struct {
		Locker          *sync.Mutex       `cql:"-"                  json:"-"`
		AdditionalName  string            `cql:"additional_name"    json:"additional_name,omitempty"      patch:"user"`
		Addresses       []PostalAddress   `cql:"addresses"          json:"addresses,omitempty"            patch:"user"`
		Avatar          string            `cql:"avatar"             json:"avatar,omitempty"               patch:"user"`
		ContactId       UUID              `cql:"contact_id"         json:"contact_id,omitempty"   elastic:"omit"`
		DateInsert      time.Time         `cql:"date_insert"        json:"date_insert,omitempty"          formatter:"RFC3339Milli"`
		DateUpdate      time.Time         `cql:"date_update"        json:"date_update,omitempty"          formatter:"RFC3339Milli"`
		Deleted         time.Time         `cql:"deleted"            json:"deleted,omitempty"              formatter:"RFC3339Milli"`
		Emails          []EmailContact    `cql:"emails"             json:"emails,omitempty"               patch:"user"`
		FamilyName      string            `cql:"family_name"        json:"family_name,omitempty"          patch:"user"`
		GivenName       string            `cql:"given_name"         json:"given_name,omitempty"           patch:"user"`
		Groups          []string          `cql:"groups"             json:"groups,omitempty"               patch:"user"`
		Identities      []SocialIdentity  `cql:"identities"         json:"identities,omitempty"           patch:"user"`
		Ims             []IM              `cql:"ims"                json:"ims,omitempty"                  patch:"user"`
		Infos           map[string]string `cql:"infos"              json:"infos,omitempty"                patch:"user"`
		NamePrefix      string            `cql:"name_prefix"        json:"name_prefix,omitempty"          patch:"user"`
		NameSuffix      string            `cql:"name_suffix"        json:"name_suffix,omitempty"          patch:"user"`
		Organizations   []Organization    `cql:"organizations"      json:"organizations,omitempty"        patch:"user"`
		Phones          []Phone           `cql:"phones"             json:"phones,omitempty"               patch:"user"`
		PrivacyIndex    *PrivacyIndex     `cql:"pi"                 json:"pi,omitempty"`
		PublicKeys      []PublicKey       `cql:"-"                  json:"public_keys,omitempty"          patch:"user"`
		PrivacyFeatures *PrivacyFeatures  `cql:"privacy_features"   json:"privacy_features,omitempty"`
		Tags            []string          `cql:"tagnames"           json:"tags,omitempty"                 patch:"system"`
		Title           string            `cql:"title"              json:"title,omitempty"                patch:"user"`
		UserId          UUID              `cql:"user_id"            json:"user_id,omitempty"`
	}

	// ContactByContactPoints is the model of a Cassandra table to lookup contacts by address/email/phone/etc.
	ContactByContactPoints struct {
		ContactID string `cql:"contact_id"`
		Type      string `cql:"type"`
		UserID    string `cql:"user_id"`
		Value     string `cql:"value"`
	}
)

// UnmarshalCQLMap hydrates a Contact with data from a map[string]interface{}
// typical usage is for unmarshaling response from Cassandra backend
func (contact *Contact) UnmarshalCQLMap(input map[string]interface{}) {
	if additionalName, ok := input["additional_name"].(string); ok {
		contact.AdditionalName = additionalName
	}
	if addresses, ok := input["addresses"]; ok && addresses != nil {
		contact.Addresses = []PostalAddress{}
		for _, address := range addresses.([]map[string]interface{}) {
			pa := PostalAddress{}
			addressId, _ := address["address_id"].(gocql.UUID)
			pa.AddressId.UnmarshalBinary(addressId.Bytes())
			pa.City, _ = address["city"].(string)
			pa.Country, _ = address["country"].(string)
			pa.IsPrimary, _ = address["is_primary"].(bool)
			pa.Label, _ = address["label"].(string)
			pa.PostalCode, _ = address["postal_code"].(string)
			pa.Region, _ = address["region"].(string)
			pa.Street, _ = address["street"].(string)
			pa.Type, _ = address["type"].(string)
			contact.Addresses = append(contact.Addresses, pa)
		}
	}

	if avatar, ok := input["avatar"].(string); ok {
		contact.Avatar = avatar
	}
	if contactId, ok := input["contact_id"].(gocql.UUID); ok {
		contact.ContactId.UnmarshalBinary(contactId.Bytes())
	}
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		contact.DateInsert = dateInsert
	}
	if dateUpdate, ok := input["date_update"].(time.Time); ok {
		contact.DateUpdate = dateUpdate
	}
	if deleted, ok := input["deleted"].(time.Time); ok {
		contact.Deleted = deleted
	}
	if emails, ok := input["emails"]; ok && emails != nil {
		contact.Emails = []EmailContact{}
		for _, email := range emails.([]map[string]interface{}) {
			e := EmailContact{}
			e.Address, _ = email["address"].(string)
			emailId, _ := email["email_id"].(gocql.UUID)
			e.EmailId.UnmarshalBinary(emailId.Bytes())
			e.IsPrimary, _ = email["is_primary"].(bool)
			e.Label, _ = email["label"].(string)
			e.Type, _ = email["type"].(string)
			contact.Emails = append(contact.Emails, e)
		}
	}

	if familyName, ok := input["family_name"].(string); ok {
		contact.FamilyName = familyName
	}
	if givenName, ok := input["given_name"].(string); ok {
		contact.GivenName = givenName
	}
	if groups, ok := input["groups"].([]string); ok {
		contact.Groups = groups
	}
	if identities, ok := input["identities"]; ok && identities != nil {
		contact.Identities = []SocialIdentity{}
		for _, identity := range identities.([]map[string]interface{}) {
			i := SocialIdentity{}
			i.Infos, _ = identity["infos"].(map[string]string)
			i.Name, _ = identity["name"].(string)
			socialId, _ := identity["social_id"].(gocql.UUID)
			i.SocialId.UnmarshalBinary(socialId.Bytes())
			i.Type, _ = identity["type"].(string)
			contact.Identities = append(contact.Identities, i)
		}
	}
	if ims, ok := input["ims"]; ok && ims != nil {
		contact.Ims = []IM{}
		for _, im := range ims.([]map[string]interface{}) {
			i_m := IM{}
			i_m.Address, _ = im["address"].(string)
			imid, _ := im["im_id"].(gocql.UUID)
			i_m.IMId.UnmarshalBinary(imid.Bytes())
			i_m.IsPrimary, _ = im["is_primary"].(bool)
			i_m.Label, _ = im["label"].(string)
			i_m.Protocol, _ = im["protocol"].(string)
			i_m.Type, _ = im["type"].(string)
			contact.Ims = append(contact.Ims, i_m)
		}
	}

	if infos, ok := input["infos"].(map[string]string); ok {
		contact.Infos = infos
	}
	if namePrefix, ok := input["name_prefix"].(string); ok {
		contact.NamePrefix = namePrefix
	}
	if nameSuffix, ok := input["name_suffix"].(string); ok {
		contact.NameSuffix = nameSuffix
	}
	if organizations, ok := input["organizations"]; ok && organizations != nil {
		contact.Organizations = []Organization{}
		for _, org := range organizations.([]map[string]interface{}) {
			o := Organization{}
			o.Deleted, _ = org["deleted"].(bool)
			o.Department, _ = org["department"].(string)
			o.IsPrimary, _ = org["is_primary"].(bool)
			o.JobDescription, _ = org["job_description"].(string)
			o.Label, _ = org["label"].(string)
			o.Name, _ = org["name"].(string)
			orgId, _ := org["organization_id"].(gocql.UUID)
			o.OrganizationId.UnmarshalBinary(orgId.Bytes())
			o.Title, _ = org["title"].(string)
			o.Type, _ = org["type"].(string)
			contact.Organizations = append(contact.Organizations, o)
		}
	}

	if phones, ok := input["phones"]; ok && phones != nil {
		contact.Phones = []Phone{}
		for _, phone := range phones.([]map[string]interface{}) {
			p := Phone{}
			p.IsPrimary, _ = phone["is_primary"].(bool)
			p.Number, _ = phone["number"].(string)
			phoneId, _ := phone["phone_id"].(gocql.UUID)
			p.PhoneId.UnmarshalBinary(phoneId.Bytes())
			p.Type, _ = phone["type"].(string)
			p.Uri, _ = phone["uri"].(string)
			contact.Phones = append(contact.Phones, p)
		}
	}

	if i_pi, ok := input["pi"].(map[string]interface{}); ok && i_pi != nil {
		pi := PrivacyIndex{}
		pi.Comportment, _ = i_pi["comportment"].(int)
		pi.Context, _ = i_pi["context"].(int)
		pi.DateUpdate, _ = i_pi["date_update"].(time.Time)
		pi.Technic, _ = i_pi["technic"].(int)
		pi.Version, _ = i_pi["version"].(int)
		contact.PrivacyIndex = &pi
	} else {
		contact.PrivacyIndex = nil
	}
	if i_pf, ok := input["privacy_features"].(map[string]string); ok && i_pf != nil {
		pf := PrivacyFeatures{}
		for k, v := range i_pf {
			pf[k] = v
		}
		contact.PrivacyFeatures = &pf

	} else {
		contact.PrivacyFeatures = nil
	}

	if tags, ok := input["tagnames"].([]string); ok {
		contact.Tags = tags
	}
	if title, ok := input["title"].(string); ok {
		contact.Title = title
	}
	if userid, ok := input["user_id"].(gocql.UUID); ok {
		contact.UserId.UnmarshalBinary(userid.Bytes())
	}
}

func (c *Contact) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return c.UnmarshalMap(input)
}

// UnmarshalMap hydrates a Contact with data from a map[string]interface{}
func (c *Contact) UnmarshalMap(input map[string]interface{}) error {

	if additionalName, ok := input["additional_name"].(string); ok {
		c.AdditionalName = additionalName
	}
	//addresses
	if pa, ok := input["addresses"]; ok && pa != nil {
		c.Addresses = []PostalAddress{}
		for _, address := range pa.([]interface{}) {
			PA := new(PostalAddress)
			if err := PA.UnmarshalMap(address.(map[string]interface{})); err == nil {
				c.Addresses = append(c.Addresses, *PA)
			}
		}
	}
	if avatar, ok := input["avatar"].(string); ok {
		c.Avatar = avatar
	}
	if contact_id, ok := input["contact_id"].(string); ok {
		if id, err := uuid.FromString(contact_id); err == nil {
			c.ContactId.UnmarshalBinary(id.Bytes())
		}
	}
	if date, ok := input["date_insert"]; ok {
		c.DateInsert, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if date, ok := input["date_update"]; ok {
		c.DateUpdate, _ = time.Parse(time.RFC3339Nano, date.(string))
	}
	if deleted, ok := input["deleted"]; ok {
		c.Deleted, _ = time.Parse(time.RFC3339Nano, deleted.(string))
	}
	//emails
	if emails, ok := input["emails"]; ok && emails != nil {
		c.Emails = []EmailContact{}
		for _, email := range emails.([]interface{}) {
			E := new(EmailContact)
			if err := E.UnmarshalMap(email.(map[string]interface{})); err == nil {
				c.Emails = append(c.Emails, *E)
			}
		}
	}

	if familyName, ok := input["family_name"].(string); ok {
		c.FamilyName = familyName
	}
	if givenName, ok := input["given_name"].(string); ok {
		c.GivenName = givenName
	}
	if groups, ok := input["groups"]; ok {
		c.Groups = []string{}
		for _, group := range groups.([]interface{}) {
			c.Groups = append(c.Groups, group.(string))
		}
	}
	//identities
	if identities, ok := input["identities"]; ok && identities != nil {
		c.Identities = []SocialIdentity{}
		for _, identity := range identities.([]interface{}) {
			I := new(SocialIdentity)
			I.Infos = map[string]string{}
			if err := I.UnmarshalMap(identity.(map[string]interface{})); err == nil {
				c.Identities = append(c.Identities, *I)
			}
		}
	}
	//Ims
	if ims, ok := input["ims"]; ok && ims != nil {
		c.Ims = []IM{}
		for _, im := range ims.([]interface{}) {
			I := new(IM)
			if err := I.UnmarshalMap(im.(map[string]interface{})); err == nil {
				c.Ims = append(c.Ims, *I)
			}
		}
	}
	if infos, ok := input["infos"].(map[string]interface{}); ok && infos != nil {
		c.Infos = make(map[string]string)
		for k, v := range infos {
			c.Infos[k] = v.(string)
		}
	}
	if namePrefix, ok := input["name_prefix"].(string); ok {
		c.NamePrefix = namePrefix
	}
	if nameSuffix, ok := input["name_suffix"].(string); ok {
		c.NameSuffix = nameSuffix
	}
	//organizations
	if orgas, ok := input["organizations"]; ok && orgas != nil {
		c.Organizations = []Organization{}
		for _, orga := range orgas.([]interface{}) {
			O := new(Organization)
			if err := O.UnmarshalMap(orga.(map[string]interface{})); err == nil {
				c.Organizations = append(c.Organizations, *O)
			}
		}
	}
	//phones
	if phones, ok := input["phones"]; ok && phones != nil {
		c.Phones = []Phone{}
		for _, phone := range phones.([]interface{}) {
			P := new(Phone)
			if err := P.UnmarshalMap(phone.(map[string]interface{})); err == nil {
				c.Phones = append(c.Phones, *P)
			}
		}
	}
	//PrivacyIndex
	if pi, ok := input["pi"]; ok && pi != nil {
		PI := new(PrivacyIndex)
		if err := PI.UnmarshalMap(pi.(map[string]interface{})); err == nil {
			c.PrivacyIndex = PI
		}
	}
	//PublicKeys
	if pks, ok := input["public_keys"]; ok && pks != nil {
		c.PublicKeys = []PublicKey{}
		for _, pk := range pks.([]interface{}) {
			K := new(PublicKey)
			if err := K.UnmarshalMap(pk.(map[string]interface{})); err == nil {
				c.PublicKeys = append(c.PublicKeys, *K)
			}
		}
	}
	// Privacy features
	if pf, ok := input["privacy_features"]; ok && pf != nil {
		PF := &PrivacyFeatures{}
		PF.UnmarshalMap(pf.(map[string]interface{}))
		c.PrivacyFeatures = PF
	}
	if tags, ok := input["tags"].([]interface{}); ok && tags != nil {
		c.Tags = []string{}
		for _, tag := range tags {
			c.Tags = append(c.Tags, tag.(string))
		}
	}
	if title, ok := input["title"].(string); ok {
		c.Title = title
	}
	if user_id, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(user_id); err == nil {
			c.UserId.UnmarshalBinary(id.Bytes())
		}
	}

	return nil
}

// return a JSON representation of Contact suitable for frontend client
func (c *Contact) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", c)
}

func (c *Contact) MarshalES() ([]byte, error) {
	return JSONMarshaller("elastic", c)
}

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaller takes account of custom tags for given 'context'
func (c *Contact) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", c)
}

func (c *Contact) JsonTags() map[string]string {
	return jsonTags(c)
}

func (c *Contact) NewEmpty() interface{} {
	nc := new(Contact)
	nc.Addresses = []PostalAddress{}
	nc.Emails = []EmailContact{}
	nc.Groups = []string{}
	nc.Identities = []SocialIdentity{}
	nc.Ims = []IM{}
	nc.Infos = map[string]string{}
	nc.Organizations = []Organization{}
	nc.Phones = []Phone{}
	nc.PublicKeys = []PublicKey{}
	nc.Tags = []string{}
	return nc
}

// GetSetNested returns a chan to iterate over pointers to embedded structs.
// It allows the caller to get and/or set embedded structs, concurrent safely.
func (c *Contact) GetSetNested() <-chan interface{} {
	getSet := make(chan interface{})
	if c.Locker == nil {
		c.Locker = new(sync.Mutex)
	}
	go func(*sync.Mutex, chan interface{}) {
		c.Locker.Lock()
		// Addresses
		for i := range c.Addresses {
			getSet <- &(c.Addresses[i])
		}
		// Emails
		for i := range c.Emails {
			getSet <- &(c.Emails[i])
		}
		// Identities
		for i := range c.Identities {
			getSet <- &(c.Identities[i])
		}
		// Ims
		for i := range c.Ims {
			getSet <- &(c.Ims[i])
		}
		// Organizations
		for i := range c.Organizations {
			getSet <- &(c.Organizations[i])
		}
		// Phones
		for i := range c.Phones {
			getSet <- &(c.Phones[i])
		}
		close(getSet)
		c.Locker.Unlock()
	}(c.Locker, getSet)

	return getSet
}

// GetRelatedList returns a map[PropertyKey]Type of structs that are embedded into a Contact from joined tables
func (c *Contact) GetRelatedList() map[string]interface{} {
	/* TODO
	return map[string]interface{}{
		"PublicKeys": &PublicKey{},
	}
	*/
	return map[string]interface{}{}
}

// GetSetRelated returns a chan to iterate over pointers to embedded structs that are stored in separate tables.
// It allows the caller to get and/or set these structs, concurrent safely.
func (c *Contact) GetSetRelated() <-chan interface{} {
	getSet := make(chan interface{})
	if c.Locker == nil {
		c.Locker = new(sync.Mutex)
	}
	go func(*sync.Mutex, chan interface{}) {
		c.Locker.Lock()
		/* TODO
		for i, _ := range c.PublicKeys {
			getSet <- &(c.PublicKeys[i])
		}
		*/
		close(getSet)
		c.Locker.Unlock()
	}(c.Locker, getSet)

	return getSet
}

// GetLookups returns a map of table(s) and model(s) that must be up-to-date with Contact.
// These structs must implement StoreLookup interface
func (c *Contact) GetLookupsTables() map[string]StoreLookup {
	return map[string]StoreLookup{
		"contact_lookup": &ContactByContactPoints{},
		//"participant_lookup": &ContactByContactPoints{}, TODO
	}
}

// SortSlices implements CaliopenObject interface.
// It ensure that all embedded slices are sorted in a determinist way
func (c *Contact) SortSlices() {
	sort.Sort(ByPostalAddressID(c.Addresses))
	sort.Sort(ByEmailContactID(c.Emails))
	sort.Strings(c.Groups)
	sort.Sort(BySocialIdentityID(c.Identities))
	sort.Sort(ByIMID(c.Ims))
	sort.Sort(ByOrganizationID(c.Organizations))
	sort.Sort(ByPhoneID(c.Phones))
	sort.Sort(ByKeyId(c.PublicKeys))
	sort.Strings(c.Tags)
}

// MarshallNew implements CaliopenObject interface
func (c *Contact) MarshallNew(args ...interface{}) {
	if len(c.ContactId) == 0 || (bytes.Equal(c.ContactId.Bytes(), EmptyUUID.Bytes())) {
		c.ContactId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if len(c.UserId) == 0 || (bytes.Equal(c.UserId.Bytes(), EmptyUUID.Bytes())) {
		if len(args) == 1 {
			switch args[0].(type) {
			case UUID:
				c.UserId = args[0].(UUID)
			}
		}
	}

	if c.DateInsert.IsZero() {
		c.DateInsert = time.Now()
		c.DateUpdate = time.Now()
	}

	c.Deleted = time.Time{}

	for i := range c.Addresses {
		c.Addresses[i].MarshallNew()
	}

	for i := range c.Emails {
		c.Emails[i].MarshallNew()
	}

	for i := range c.Identities {
		c.Identities[i].MarshallNew()
	}

	for i := range c.Organizations {
		c.Organizations[i].MarshallNew()
	}

	for i := range c.Phones {
		c.Phones[i].MarshallNew()
	}

	for i := range c.PublicKeys {
		c.PublicKeys[i].MarshallNew(c)
	}

}

// GetLookupKeys returns a chan to iterate over fields and values that make up the lookup tables keys
func (c *Contact) GetLookupKeys() <-chan StoreLookup {
	getter := make(chan StoreLookup)
	contactId := c.ContactId.String()
	userId := c.UserId.String()
	go func(chan StoreLookup) {
		// emails
		for _, email := range c.Emails {
			key := ContactByContactPoints{
				ContactID: contactId,
				Type:      "email",
				UserID:    userId,
				Value:     email.Address,
			}
			getter <- &key
		}
		// identities
		for _, identity := range c.Identities {
			key := ContactByContactPoints{
				ContactID: contactId,
				Type:      identity.Type,
				UserID:    userId,
				Value:     identity.Name,
			}
			getter <- &key
		}
		// Ims
		for _, im := range c.Ims {
			key := ContactByContactPoints{
				ContactID: contactId,
				Type:      im.Protocol,
				UserID:    userId,
				Value:     im.Address,
			}
			getter <- &key
		}
		// phones
		for _, phone := range c.Phones {
			key := ContactByContactPoints{
				ContactID: contactId,
				Type:      "phone",
				UserID:    userId,
				Value:     phone.Number,
			}
			getter <- &key

		}
		close(getter)
	}(getter)

	return getter
}

// UpdateLookups iterates over contact's lookups to add or update them to the relevant table,
// then it deletes lookups references that are no more linked to an embedded key which has been removed.
// contacts should have one item in the context of a creation or two items [new, old] in the context of an update
func (lookup *ContactByContactPoints) UpdateLookups(contacts ...interface{}) func(session *gocql.Session) error {
	contactsLen := len(contacts)
	update := false
	if contactsLen > 0 {
		newContact := contacts[0].(*Contact)
		oldLookups := map[string]*ContactByContactPoints{}     // lookups found in old contact
		removedLookups := map[string]*ContactByContactPoints{} // drained by loops below
		return func(session *gocql.Session) error {
			if contactsLen == 2 && contacts[1] != nil {
				// it's an update, get a list of old lookupKeys to later find those that have been removed
				update = true
				oldContact := contacts[1].(*Contact)
				for lookup := range oldContact.GetLookupKeys() {
					lkp := lookup.(*ContactByContactPoints)
					lkpKey := lkp.UserID + lkp.Value + lkp.Type
					oldLookups[lkpKey] = lkp
					removedLookups[lkpKey] = lkp
				}
			}
			// iterate over contact's current state to add or update lookups
			for lookup := range newContact.GetLookupKeys() {
				lkp := lookup.(*ContactByContactPoints)
				lkpKey := lkp.UserID + lkp.Value + lkp.Type
				// check if it's a new uri
				if _, ok := oldLookups[lkpKey]; !ok || !update {
					err := session.Query(`INSERT INTO contact_lookup (user_id, value, type, contact_id) VALUES (?,?,?,?)`,
						lkp.UserID,
						lkp.Value,
						lkp.Type,
						lkp.ContactID,
					).Exec()
					if err != nil {
						log.WithError(err).Warnf(`[CassandraBackend] UpdateLookups INSERT failed for user: %s, value: %s, type: %s`,
							lkp.UserID,
							lkp.Value,
							lkp.Type)
					}
					// do the job of updating participants and discussion related tables
					err = updateURIWithContact(session, lkp, true)
					if err != nil {
						// TODO : handle multiple error returns to merge into one error or break immediately ?
						log.WithError(err).Errorf("[Contact.UpdateLookups] associateURIWithContact failed with lookup %+v", lkp)
					}
					if update {
						// remove keys in removedLookups,
						// thus at end it will only hold remaining entries that are not in the new state
						delete(removedLookups, lkpKey)

					}
				}
			}
			if len(removedLookups) > 0 {
				// it remains lookups in the map, meaning these lookups references have been removed from contact
				// need to cleanup lookup tables
				for _, lookup := range removedLookups {
					// try to get the contact_lookup
					err := session.Query(`DELETE FROM contact_lookup WHERE user_id = ? AND value = ? AND type = ?`,
						lookup.UserID,
						lookup.Value,
						lookup.Type,
					).Exec()
					if err != nil {
						log.WithError(err).Warnf(`[CassandraBackend] UpdateLookups DELETE failed for user: %s, value: %s, type: %s`,
							lookup.UserID,
							lookup.Value,
							lookup.Type)
					}
					// do the job of updating participants and discussion related tables
					err = updateURIWithContact(session, lookup, false)
					if err != nil {
						// TODO : handle multiple error returns to merge into one error or break immediately ?
					}
				}
			}
			return nil
		}
	}
	return nil
}

// CleanupLookups implements StoreLookup interface.
// It returns a func which removes all contact points related to the contact given as param of the variadic func.
func (lookup *ContactByContactPoints) CleanupLookups(contacts ...interface{}) func(session *gocql.Session) error {
	if len(contacts) == 1 {
		contact := contacts[0].(*Contact)
		return func(session *gocql.Session) error {
			// seek into contact_lookup to delete references to the deleted contact
			related, err := session.Query(`SELECT * from contact_lookup WHERE user_id = ?`, contact.UserId.String()).Iter().SliceMap()
			if err != nil {
				return err
			}
			for _, lookup := range related {
				ids := lookup["contact_id"].([]gocql.UUID)
				updated_ids := []string{}
				for _, id := range ids {
					if id.String() != contact.ContactId.String() { // keep only contact_ids that are not from the deleted contact
						updated_ids = append(updated_ids, id.String())
					}
				}
				if len(ids) == 0 || // we found an empty lookup: it should have been removed ! cleaning up
					len(updated_ids) == 0 { // lookup had only one contact_ids and we just deleted it. cleaning up
					err := session.Query(`DELETE FROM contact_lookup WHERE user_id = ? AND value = ? AND type = ?`,
						lookup["user_id"],
						lookup["value"],
						lookup["type"]).Exec()
					if err != nil {
						return err
					}
				} else if len(ids) != len(updated_ids) { // an id has been pop, need to update contact_lookup
					err := session.Query(`UPDATE contact_lookup SET contact_ids = ? WHERE user_id = ? AND value = ? AND type = ?`,
						updated_ids,
						lookup["user_id"],
						lookup["value"],
						lookup["type"]).Exec()
					if err != nil {
						return err
					}
				}
			}
			return nil
		}
	}
	return nil
}

// updateURIWithContact is algorithm to update hashes in ParticipantHash table
// to be able to link URI with contact when building discussions
// if associate == true, then lkp is associated with contact, else it is dissociated from contact
func updateURIWithContact(session *gocql.Session, lkp *ContactByContactPoints, associate bool) error {
	// lookup uris_hashes where lkp's uri is embedded
	lkpUri := lkp.Type + ":" + lkp.Value
	uriLookups, err := session.Query(`SELECT * FROM hash_lookup WHERE user_id = ? AND uri = ?`, lkp.UserID, lkpUri).Iter().SliceMap()
	if err != nil {
		return err
	}

	// for each uris_hash found, lookup its participant_hash counterpart
	participantHashes := []ParticipantHash{}
	urisComponents := map[string][]string{}
	for _, lookup := range uriLookups {
		var uriHash HashLookup
		uriHash.UnmarshalCQLMap(lookup)
		urisComponents[uriHash.Hash] = uriHash.HashComponents
		var participants string
		err := session.Query(`SELECT value FROM participant_hash WHERE user_id = ? AND kind = ? AND key = ?`, lkp.UserID, "uris", uriHash.Hash).Scan(&participants)
		if err != nil {
			if err.Error() == "not found" {
				continue
			} else {
				log.WithError(err).Warnf("updateURIWithContact failed to query participant_hash for user_id = %s, kind = %s, key = %s", lkp.UserID, "uris", uriHash.Hash)
				continue
			}
		}
		row := map[string]interface{}{}
		err = session.Query(`SELECT * FROM participant_hash WHERE user_id = ? AND kind = ? AND key = ?`, lkp.UserID, "participants", participants).MapScan(row)
		if err != nil {
			if err.Error() == "not found" {
				continue
			} else {
				log.WithError(err).Warnf("updateURIWithContact failed to query participant_hash for user_id = %s, kind = %s, key = %s", lkp.UserID, "participants", uriHash.Hash)
				continue
			}
		}
		var participantHash ParticipantHash
		participantHash.UnmarshalCQLMap(row)
		participantHashes = append(participantHashes, participantHash)
	}

	// for each participant_hash :
	//     - compute a new participant_hash
	//     - add new bijection uri_hash <-> new_participant_hash
	//     - remove former bijection
	for _, participantHash := range participantHashes {
		var newParticipantHash ParticipantHash
		var err error
		newParticipantHash, err = ComputeNewParticipantHash(lkpUri, lkp.ContactID, participantHash, urisComponents[participantHash.Value], associate)
		if err != nil {
			log.WithError(err).Warnf("updateURIWithContact failed to compute new participant hash for uri <%s> and former participant hash : %+v", lkpUri, participantHash)
		} else {
			err = StoreURIsParticipantsBijection(
				session,
				UUID(uuid.FromStringOrNil(lkp.UserID)),
				participantHash.Value,
				newParticipantHash.Key,
				urisComponents[participantHash.Value],
				newParticipantHash.Components,
			)
			if err != nil {
				log.WithError(err).Warn("StoreURIsParticipantsBijection failed")
			} else {
				// remove former bijection
				err = RemoveURIsParticipantsBijection(session, participantHash)
				if err != nil {
					log.WithError(err).Warn("RemoveURIsParticipantsBijection failed")
				}
			}
		}
	}

	return nil
}

// StoreURIsParticipantsBijection stores uris_hash <-> participants_hash bijection
// in participant_hash table
func StoreURIsParticipantsBijection(session *gocql.Session, userId UUID, uriHash, participantHash string, uriComponents, participantComponents []string) error {
	now := time.Now()
	// store uris_hash -> participants_hash
	e1 := session.Query(`INSERT INTO participant_hash (user_id, kind, key, value, components, date_insert) VALUES (?,?,?,?,?,?)`,
		userId, "uris", uriHash, participantHash, uriComponents, now).Exec()

	// store participants_hash -> uris_hash
	e2 := session.Query(`INSERT INTO participant_hash (user_id, kind, key, value, components, date_insert) VALUES (?,?,?,?,?,?)`,
		userId, "participants", participantHash, uriHash, participantComponents, now).Exec()
	switch {
	case e1 != nil:
		return e1
	case e2 != nil:
		return e2
	}
	return nil
}

// RemoveURIsParticipantsBijection delete uris_hash <-> participants_hash bijection
// in participant_hash table
func RemoveURIsParticipantsBijection(session *gocql.Session, participantHash ParticipantHash) error {
	var first, second string
	first = participantHash.Kind
	if first == "participants" {
		second = "uris"
	} else {
		second = "participants"
	}
	e1 := session.Query(`DELETE FROM participant_hash WHERE user_id = ? AND kind = ? AND key = ? AND value = ?`,
		participantHash.UserId,
		first,
		participantHash.Key,
		participantHash.Value).Exec()
	e2 := session.Query(`DELETE FROM participant_hash WHERE user_id = ? AND kind = ? AND key = ? AND value = ?`,
		participantHash.UserId,
		second,
		participantHash.Value,
		participantHash.Key).Exec()
	switch {
	case e1 != nil:
		return e1
	case e2 != nil:
		return e2
	}
	return nil
}
