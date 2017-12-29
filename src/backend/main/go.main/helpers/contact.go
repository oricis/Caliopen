/*
 * // Copyleft (ɔ) 2017 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package helpers

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
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
			if len(c.Emails) > 0 {
				c.Title = c.Emails[0].Address
			} else if len(c.Phones) > 0 {
				c.Title = c.Phones[0].Number
			} else if len(c.Ims) > 0 {
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
				for i, j := 0, len(space_sep)-1; i < j; i, j = i+1, j-1 {
					space_sep[i], space_sep[j] = space_sep[j], space_sep[i]
				}
				c.FamilyName = space_sep[0]
				c.GivenName = strings.Join(space_sep[1:], " ")
			} else if comma_sep := strings.Split(c.Title, ","); len(comma_sep) > 1 {
				//same algo as above, but with comma
				for i, j := 0, len(comma_sep)-1; i < j; i, j = i+1, j-1 {
					comma_sep[i], comma_sep[j] = comma_sep[j], comma_sep[i]
				}
				c.FamilyName = comma_sep[0]
				c.GivenName = strings.Join(comma_sep[1:], " ")
				c.Title = strings.Replace(c.Title, ",", " ", -1)
			} else {
				c.FamilyName = c.Title
			}
		}
	}

}

// NormalizePhoneNumbers tries to normalize phone numbers found within contact
// modifies in-place or lets phone numbers untouched if it fails
func NormalizePhoneNumbers(c *Contact) {

}
