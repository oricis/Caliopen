package objects

import (
	"encoding/json"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"time"
)

type (
	Contact struct {
		AdditionalName  string            `cql:"additional_name"    json:"additional_name"`
		Addresses       []PostalAddress   `cql:"addresses"          json:"addresses"`
		Avatar          string            `cql:"avatar"             json:"avatar"`
		ContactId       UUID              `cql:"contact_id"         json:"contact_id"`
		DateInsert      time.Time         `cql:"date_insert"        json:"date_insert"`
		DateUpdate      time.Time         `cql:"date_update"        json:"date_update"`
		Deleted         bool              `cql:"deleted"            json:"deleted"`
		Emails          []EmailContact    `cql:"emails"             json:"emails"`
		FamilyName      string            `cql:"family_name"        json:"family_name"`
		GivenName       string            `cql:"given_name"         json:"given_name"`
		Groups          []string          `cql:"groups"             json:"groups"`
		Identities      []SocialIdentity  `cql:"identities"         json:"identities"`
		Ims             []IM              `cql:"ims"                json:"ims"`
		Infos           map[string]string `cql:"infos"              json:"infos"`
		NamePrefix      string            `cql:"name_prefix"        json:"name_prefix"`
		NameSuffix      string            `cql:"name_suffix"        json:"name_suffix"`
		Organizations   []Organization    `cql:"organizations"      json:"organizations"`
		Phones          []Phone           `cql:"phones"             json:"phones"`
		PrivacyIndex    *PrivacyIndex     `cql:"pi"                 json:"pi"`
		PublicKeys      []PublicKey       `cql:"public_keys"        json:"public_keys"`
		PrivacyFeatures *PrivacyFeatures  `cql:"privacy_features"   json:"privacy_features"`
		Tags            []string          `cql:"tags"               json:"tags"                 patch:"user"`
		Title           string            `cql:"title"              json:"title"`
		UserId          UUID              `cql:"user_id"            json:"user_id"`
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

	if tags, ok := input["tags"].([]string); ok {
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
