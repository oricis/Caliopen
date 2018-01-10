package objects

import (
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"sync"
	"time"
)

type (
	// cql_lookup tags indicate properties which are a lookup value in the specified lookup table
	Contact struct {
		Locker          *sync.Mutex       `cql:"-"                  json:"-"`
		AdditionalName  string            `cql:"additional_name"    json:"additional_name"      patch:"user"`
		Addresses       []PostalAddress   `cql:"addresses"          json:"addresses"            patch:"user"`
		Avatar          string            `cql:"avatar"             json:"avatar"               patch:"user"`
		ContactId       UUID              `cql:"contact_id"         json:"contact_id"`
		DateInsert      time.Time         `cql:"date_insert"        json:"date_insert"`
		DateUpdate      time.Time         `cql:"date_update"        json:"date_update"`
		Deleted         bool              `cql:"deleted"            json:"deleted"`
		Emails          []EmailContact    `cql:"emails"             json:"emails"               patch:"user"`
		FamilyName      string            `cql:"family_name"        json:"family_name"          patch:"user"`
		GivenName       string            `cql:"given_name"         json:"given_name"           patch:"user"`
		Groups          []string          `cql:"groups"             json:"groups"               patch:"user"`
		Identities      []SocialIdentity  `cql:"identities"         json:"identities"           patch:"user"`
		Ims             []IM              `cql:"ims"                json:"ims"                  patch:"user"`
		Infos           map[string]string `cql:"infos"              json:"infos"                patch:"user"`
		NamePrefix      string            `cql:"name_prefix"        json:"name_prefix"          patch:"user"`
		NameSuffix      string            `cql:"name_suffix"        json:"name_suffix"          patch:"user"`
		Organizations   []Organization    `cql:"organizations"      json:"organizations"        patch:"user"`
		Phones          []Phone           `cql:"phones"             json:"phones"               patch:"user"`
		PrivacyIndex    *PrivacyIndex     `cql:"pi"                 json:"pi"`
		PublicKeys      PublicKeys        `cql:"-"                  json:"public_keys"`
		PrivacyFeatures *PrivacyFeatures  `cql:"privacy_features"   json:"privacy_features"`
		Tags            []string          `cql:"tagnames"           json:"tags"                 patch:"user"`
		Title           string            `cql:"title"              json:"title"                patch:"user"`
		UserId          UUID              `cql:"user_id"            json:"user_id"`
	}

	// ContactByContactPoints is the model of a Cassandra table to lookup contacts by address/email/phone/etc.
	ContactByContactPoints struct {
		ContactIDs []string `cql:"contact_ids"`
		Type       string   `cql:"type"`
		UserID     string   `cql:"user_id"`
		Value      string   `cql:"value"`
	}
)

// unmarshal a map[string]interface{} that must owns all Contact's fields
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
	if deleted, ok := input["deleted"].(bool); ok {
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
	if deleted, ok := input["deleted"].(bool); ok {
		c.Deleted = deleted
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
	if pi, ok := input["pi"]; ok {
		PI := new(PrivacyIndex)
		if err := PI.UnmarshalMap(pi.(map[string]interface{})); err == nil {
			c.PrivacyIndex = PI
		}
	}
	//PublicKeys
	if pks, ok := input["public_keys"]; ok {
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
	return c.JSONMarshaller("frontend")
}

// bespoke implementation of the json.Marshaller interface
// outputs a JSON representation of an object
// this marshaller takes account of custom tags for given 'context'
func (c *Contact) JSONMarshaller(context string) ([]byte, error) {
	return JSONMarshaller(context, c)
}

func (c *Contact) JsonTags() map[string]string {
	return jsonTags(c)
}

func (c *Contact) NewEmpty() interface{} {
	c = new(Contact)
	c.Addresses = []PostalAddress{}
	c.Emails = []EmailContact{}
	c.Groups = []string{}
	c.Identities = []SocialIdentity{}
	c.Ims = []IM{}
	c.Infos = map[string]string{}
	c.Organizations = []Organization{}
	c.Phones = []Phone{}
	c.PublicKeys = []PublicKey{}
	c.Tags = []string{}
	return c
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
		for i, _ := range c.Addresses {
			getSet <- &(c.Addresses[i])
		}
		for i, _ := range c.Emails {
			getSet <- &(c.Emails[i])
		}
		for i, _ := range c.Identities {
			getSet <- &(c.Identities[i])
		}
		for i, _ := range c.Ims {
			getSet <- &(c.Ims[i])
		}
		for i, _ := range c.Organizations {
			getSet <- &(c.Organizations[i])
		}
		for i, _ := range c.Phones {
			getSet <- &(c.Phones[i])
		}
		close(getSet)
		c.Locker.Unlock()
	}(c.Locker, getSet)

	return getSet
}

// GetRelatedList returns a map[PropertyKey]Type of structs that are embedded into a Contact from joined tables
func (c *Contact) GetRelatedList() map[string]interface{} {
	return map[string]interface{}{
		"PublicKeys": &PublicKey{},
	}
}

// GetSetRelated returns a chan to iterate over pointers to included structs that are stored in separate tables.
// It allows the caller to get and/or set these structs, concurrent safely.
func (c *Contact) GetSetRelated() <-chan interface{} {
	getSet := make(chan interface{})
	if c.Locker == nil {
		c.Locker = new(sync.Mutex)
	}
	go func(*sync.Mutex, chan interface{}) {
		c.Locker.Lock()
		for i, _ := range c.PublicKeys {
			getSet <- &(c.PublicKeys[i])
		}
		close(getSet)
		c.Locker.Unlock()
	}(c.Locker, getSet)

	return getSet
}

// GetLookups returns a slide of structs that must be up-to-date with Contact.
// These structs must implement StoreLookup interface
func (c *Contact) GetLookups() []StoreLookup {
	return []StoreLookup{
		&ContactByContactPoints{},
	}
}

// CleanupLookups implements StoreLookup interface.
// It returns a func which removes contact points related to the contact given as param of the variadic func.
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
				ids := lookup["contact_ids"].([]gocql.UUID)
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
