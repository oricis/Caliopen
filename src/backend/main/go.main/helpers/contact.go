/*
 * // Copyleft (ɔ) 2017 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package helpers

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/ttacon/libphonenumber"
	"strings"
)

// ComputeTitle modifies Title property in-place or do nothing if it fails
// it tries to fill Title with names, then email/phones/etc.
// conversely : if names are empty but Title is not, names are filled from Title.
func ComputeTitle(c *Contact) {
	// TODO: improve it
	if c.Title == "" {
		title := []string{}
		if c.NamePrefix != "" {
			title = append(title, c.NamePrefix)
		}
		if c.GivenName != "" {
			title = append(title, c.GivenName)
		}
		if c.AdditionalName != "" {
			title = append(title, c.AdditionalName)
		}
		if c.FamilyName != "" {
			title = append(title, c.FamilyName)
		}
		if c.NameSuffix != "" {
			title = append(title, c.NameSuffix)
		}
		switch len(title) {
		case 0:
			//Title is still empty. try more properties
			switch {
			case len(c.Emails) > 0:
				c.Title = c.Emails[0].Address
			case len(c.Phones) > 0:
				c.Title = c.Phones[0].Number
			case len(c.Ims) > 0:
				c.Title = c.Ims[0].Address
			}
		case 1:
			c.Title = title[0]
		default:
			c.Title = strings.Join(title, " ")
		}
	} else {
		// Title has been set by user,
		// if given_name & family_name are empty we try to fill them from title
		if c.GivenName == "" && c.FamilyName == "" {
			if space_sep := strings.Split(c.Title, " "); len(space_sep) > 1 {
				//fill it the Google way : last word to family_name
				c.FamilyName = space_sep[len(space_sep)-1]
				c.GivenName = strings.Join(space_sep[:len(space_sep)-1], " ")
			} else if comma_sep := strings.Split(c.Title, ","); len(comma_sep) > 1 {
				//same algo as above, but with comma
				c.FamilyName = space_sep[len(space_sep)-1]
				c.GivenName = strings.Join(space_sep[:len(space_sep)-1], " ")
				c.Title = strings.Replace(c.Title, ",", " ", -1)
			} else {
				c.FamilyName = c.Title
			}
		}
	}

}

// NormalizePhoneNumbers tries to normalize phone numbers found within contact.
// It fills Phone.NormalizedNumber property if it could
func NormalizePhoneNumbers(c *Contact) {
	var num libphonenumber.PhoneNumber
	for i, phone := range c.Phones {
		// try to parse phone number by seeking a country code
		// fallback to french number only if no country code could be found
		// TODO: lookup into user's contactbook to find the most relevant country code to fallback to
		if err := libphonenumber.ParseToNumber(phone.Number, "FR", &num); err == nil {
			c.Phones[i].NormalizedNumber = libphonenumber.Format(&num, libphonenumber.INTERNATIONAL)
		}
	}
}
