// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package contact

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/emersion/go-vcard"
	"github.com/satori/go.uuid"
	"strings"
)

type VcardParser interface {
	AddVcard(vcard.Card) error
}

type ContactParser struct {
	UserId   objects.UUID
	Contacts []objects.Contact
}

func parseEmail(field *vcard.Field) *objects.EmailContact {
	email := new(objects.EmailContact)
	uid := new(objects.UUID)
	_ = uid.UnmarshalBinary(uuid.NewV4().Bytes())
	email.EmailId = *uid
	email.Address = strings.ToLower(field.Value)
	if field.Params["TYPE"] != nil {
		email.Type = strings.ToLower(field.Params["TYPE"][0])
	}
	// TODO complete struct filling
	email.Label = field.Value
	return email
}

func parsePhone(field *vcard.Field) *objects.Phone {
	phone := new(objects.Phone)
	uid := new(objects.UUID)
	_ = uid.UnmarshalBinary(uuid.NewV4().Bytes())
	phone.PhoneId = *uid
	phone.Number = field.Value
	if field.Params["TYPE"] != nil {
		phone.Type = strings.ToLower(field.Params["TYPE"][0])
	}
	return phone
}

func parseAddress(addr *vcard.Address) *objects.PostalAddress {
	address := new(objects.PostalAddress)
	uid := new(objects.UUID)
	_ = uid.UnmarshalBinary(uuid.NewV4().Bytes())
	address.AddressId = *uid
	address.City = addr.Locality
	address.Country = addr.Country
	address.Region = addr.Region
	address.PostalCode = addr.PostalCode
	address.Street = addr.StreetAddress
	return address
}

func (parser *ContactParser) AddVcard(card vcard.Card) error {
	contact := new(objects.Contact).NewEmpty().(*objects.Contact)
	contact.UserId = parser.UserId
	contact.Title = card.PreferredValue(vcard.FieldFormattedName)
	if card.Name() != nil {
		contact.FamilyName = card.Name().FamilyName
		contact.GivenName = card.Name().GivenName
	}

	// emails
	emails := card[vcard.FieldEmail]
	if emails != nil {
		contact.Emails = []objects.EmailContact{}
		for _, email := range emails {
			e := parseEmail(email)
			contact.Emails = append(contact.Emails, *e)
		}
	}

	// phones
	phones := card[vcard.FieldTelephone]
	if phones != nil {
		contact.Phones = []objects.Phone{}
		for _, phone := range phones {
			p := parsePhone(phone)
			contact.Phones = append(contact.Phones, *p)
		}
	}
	helpers.NormalizePhoneNumbers(contact)

	// addresses
	addrs := card.Addresses()
	if addrs != nil {
		contact.Addresses = []objects.PostalAddress{}
		for _, addr := range addrs {
			a := parseAddress(addr)
			contact.Addresses = append(contact.Addresses, *a)
		}
	}
	/*
		TODO: Need to change index mappings of contact.infos
		infos := make(map[string]string)
		if uid := card[vcard.FieldUID]; uid != nil {
			infos["uid"] = uid[0].Value
		}
		if rev := card[vcard.FieldRevision]; rev != nil {
			infos["revision"] = rev[0].Value
		}
		contact.Infos = make(map[string]string)
		for k, v := range infos {
			contact.Infos[k] = v
		}
	*/

	// Compute a title if none found
	if contact.Title == "" {
		helpers.ComputeNewTitle(contact)
	}
	parser.Contacts = append(parser.Contacts, *contact)
	return nil
}
