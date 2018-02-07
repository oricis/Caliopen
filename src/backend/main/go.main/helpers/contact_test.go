/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package helpers

import (
	"github.com/ttacon/libphonenumber"
	"testing"
)

func TestNormalizePhoneNumbers(t *testing.T) {
	num := libphonenumber.PhoneNumber{}
	Phones := []string{
		"+33663193636",
		"+1987654",
		"123456789",
		"00 33 6 63 19 363 6",
		"820 820 823",
		"06-63-19-36-36",
		"serbie: +381 22-554 65 98",
		"+33 3665",
		"+4179 44 92 428",
		"«*(/)-«*/99999990000000000000000000999999999",
		"1800 MICROSOFT",
	}
	for _, phone := range Phones {
		t.Logf("number tested : %s\n", phone)
		err := libphonenumber.ParseToNumber(phone, "FR", &num)
		if err != nil {
			t.Logf("ERR %s", err)
		}
		t.Logf("PARSED: +%d %d\n", num.GetCountryCode(), num.GetNationalNumber())
		t.Logf("Formatted : %s\n", libphonenumber.Format(&num, libphonenumber.INTERNATIONAL))
	}
}
