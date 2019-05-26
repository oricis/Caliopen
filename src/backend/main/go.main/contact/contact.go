// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package contact

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/emersion/go-vcard"
	"strings"
)

type ContactParser struct {
	Contacts []objects.Contact
}

/*

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

*/

func parseEmail(field *vcard.Field) *objects.EmailContact {
	email := new(objects.EmailContact)
	email.Address = strings.ToLower(field.Value)
	if field.Params["TYPE"] != nil {
		email.Type = strings.ToLower(field.Params["TYPE"][0])
	}
	// TODO complete struct filling
	email.Label = field.Value
	return email
}

func parseAddress(addr *vcard.Address) *objects.PostalAddress {
	address := new(objects.PostalAddress)
	address.City = addr.Locality
	address.Country = addr.Country
	address.Region = addr.Region
	address.PostalCode = addr.PostalCode
	address.Street = addr.StreetAddress
	return address
}

func (parser *ContactParser) ProcessVcard(user_id objects.UUID, card vcard.Card) (*objects.Contact, error) {
	contact := new(objects.Contact).NewEmpty().(*objects.Contact)
	contact.UserId = user_id
	contact.Title = card.PreferredValue(vcard.FieldFormattedName)
	if card.Name() != nil {
		contact.FamilyName = card.Name().FamilyName
		contact.GivenName = card.Name().GivenName
	}
	emails := card[vcard.FieldEmail]
	if emails != nil {
		contact.Emails = []objects.EmailContact{}
		for _, email := range emails {
			e := parseEmail(email)
			contact.Emails = append(contact.Emails, *e)
		}
	}
	/*
		phones := card[vcard.FieldPhone]
		if phones != nil {
			contact.Phones = []objects.PhoneContact{}
			for _, phone := range phones {
				p := parsePhone(phone)
				contact.Phones = append(contact.Phones, *p)
			}
		}
	*/
	// TODO fill Contact.Infos with UID/REV informations
	return contact, nil
}
