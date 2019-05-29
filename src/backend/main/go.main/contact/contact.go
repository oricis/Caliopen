// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package contact

import (
	"bytes"
	"encoding/base64"
	"errors"
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	log "github.com/Sirupsen/logrus"
	"github.com/emersion/go-vcard"
	"github.com/keybase/go-crypto/openpgp"
	"github.com/satori/go.uuid"
	"strings"
)

// Parse EMAIL vcard field
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

// Parse TEL vcard field
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

// Parse IMPP vcard field
func parseIm(field *vcard.Field) *objects.IM {
	im := new(objects.IM)
	uid := new(objects.UUID)
	_ = uid.UnmarshalBinary(uuid.NewV4().Bytes())
	im.IMId = *uid
	im.Address = strings.ToLower(field.Value)
	im.Label = field.Value
	if field.Params["TYPE"] != nil {
		im.Type = strings.ToLower(field.Params["TYPE"][0])
	}
	return im
}

// Read an armored PGP public key and return an openpgp.Entity structure
func readPgpKey(pubkey []byte) (*openpgp.Entity, error) {
	reader := bytes.NewReader(pubkey)
	var entitiesList openpgp.EntityList
	var err error

	entitiesList, err = openpgp.ReadArmoredKeyRing(reader)
	if err != nil {
		return nil, err
	}

	//handle only first key found for now
	if len(entitiesList) > 1 {
		return nil, errors.New("More than one key found in payload")
	}
	return entitiesList[0], nil
}

// Parse KEY vcard field and transform to a PublicKey that belong to a contact
func parseKey(field *vcard.Field, contact *objects.Contact) (*objects.PublicKey, error) {
	key := new(objects.PublicKey)
	var err error

	if field.Params["TYPE"] != nil && field.Params["TYPE"][0] == "PGP" {
		key.KeyType = "pgp"
	}
	if field.Params["ENCODING"] != nil && field.Params["ENCODING"][0] == "b" {
		pubkey, err := base64.StdEncoding.DecodeString(field.Value)
		if err != nil {
			return &objects.PublicKey{}, err
		}
		entity, err := readPgpKey(pubkey)
		if err != nil {
			return &objects.PublicKey{}, err
		}
		err = key.UnmarshalPGPEntity("PGP key", entity, contact)
	} else {
		return &objects.PublicKey{}, errors.New("Unknow key encoding")
	}
	log.Info("Have parsed PGP key ", key.Fingerprint, " with algorithm ", key.Algorithm)
	return key, err
}

// Parse ADR vcard field
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

// Transform a vcard into an objects.Contact structure
func FromVcard(user *objects.UserInfo, card vcard.Card) (*objects.Contact, error) {
	contact := new(objects.Contact).NewEmpty().(*objects.Contact)
	contact.UserId = objects.UUID(uuid.FromStringOrNil(user.User_id))
	contact.Title = card.PreferredValue(vcard.FieldFormattedName)
	if card.Name() != nil {
		contact.FamilyName = card.Name().FamilyName
		contact.GivenName = card.Name().GivenName
	}

	// check version
	// TODO implement version 4.0 (rfc 6350)
	version := card[vcard.FieldVersion]
	if version != nil && version[0].Value == "4.0" {
		return contact, errors.New("Not supported vcard version 4.0")
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

	ims := card[vcard.FieldIMPP]
	if ims != nil {
		contact.Ims = []objects.IM{}
		for _, im := range ims {
			i := parseIm(im)
			contact.Ims = append(contact.Ims, *i)
		}
	}

	// addresses
	addrs := card.Addresses()
	if addrs != nil {
		contact.Addresses = []objects.PostalAddress{}
		for _, addr := range addrs {
			a := parseAddress(addr)
			contact.Addresses = append(contact.Addresses, *a)
		}
	}

	// public keys
	keys := card[vcard.FieldKey]
	if keys != nil {
		contact.PublicKeys = make([]objects.PublicKey, 0, len(keys))
		for _, key := range keys {
			k, err := parseKey(key, contact)
			if err != nil {
				log.Warn("Error during vcard KEY parsing ", err)
			} else {
				contact.PublicKeys = append(contact.PublicKeys, *k)
			}
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

	return contact, nil
}
