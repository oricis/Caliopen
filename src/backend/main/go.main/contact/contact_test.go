package contact

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"strings"
	"testing"
)

// https://en.wikipedia.org/wiki/VCard#vCard_2.1
var testWikipediav2_1 = `BEGIN:VCARD
VERSION:2.1
N:Gump;Forrest;;Mr.
FN:Forrest Gump
ORG:Bubba Gump Shrimp Co.
TITLE:Shrimp Man
PHOTO;GIF:http://www.example.com/dir_photos/my_photo.gif
TEL;WORK;VOICE:(111) 555-1212
TEL;HOME;VOICE:(404) 555-1212
ADR;WORK;PREF:;;100 Waters Edge;Baytown;LA;30314;United States of America
LABEL;WORK;PREF;ENCODING=QUOTED-PRINTABLE;CHARSET=UTF-8:100 Waters Edge=0D=
 =0ABaytown\, LA 30314=0D=0AUnited States of America
ADR;HOME:;;42 Plantation St.;Baytown;LA;30314;United States of America
LABEL;HOME;ENCODING=QUOTED-PRINTABLE;CHARSET=UTF-8:42 Plantation St.=0D=0A=
 Baytown, LA 30314=0D=0AUnited States of America
EMAIL:forrestgump@example.com
REV:20080424T195243Z
END:VCARD`

// https://en.wikipedia.org/wiki/VCard#vCard_3.0
var testWikipediav3 = `BEGIN:VCARD
VERSION:3.0
N:Gump;Forrest;;Mr.;
FN:Forrest Gump
ORG:Bubba Gump Shrimp Co.
TITLE:Shrimp Man
PHOTO;VALUE=URI;TYPE=GIF:;http://www.example.com/dir_photos/my_photo.gif
TEL;TYPE=WORK,VOICE:(111) 555-1212
TEL;TYPE=HOME,VOICE:(404) 555-1212
ADR;TYPE=WORK,PREF:;;100 Waters Edge;Baytown;LA;30314;United States of America
LABEL;TYPE=WORK,PREF:100 Waters Edge\nBaytown\, LA 30314\nUnited States of America
ADR;TYPE=HOME:;;42 Plantation St.;Baytown;LA;30314;United States of America
LABEL;TYPE=HOME:42 Plantation St.\nBaytown\, LA 30314\nUnited States of America
EMAIL:forrestgump@example.com
REV:2008-04-24T19:52:43Z
END:VCARD`

// https://en.wikipedia.org/wiki/VCard#vCard_4.0
var testWikipediav4 = `BEGIN:VCARD
VERSION:4.0
N:Gump;Forrest;;Mr.;
FN:Forrest Gump
ORG:Bubba Gump Shrimp Co.
TITLE:Shrimp Man
PHOTO;MEDIATYPE=image/gif:http://www.example.com/dir_photos/my_photo.gif
TEL;TYPE=work,voice;VALUE=uri:tel:+1-111-555-1212
TEL;TYPE=home,voice;VALUE=uri:tel:+1-404-555-1212
ADR;TYPE=WORK;PREF=1;LABEL="100 Waters Edge\nBaytown\, LA 30314\nUnited States of America":;;100 Waters Edge;Baytown;LA;30314;United St
ates of America
ADR;TYPE=HOME;LABEL="42 Plantation St.\nBaytown\, LA 30314\nUnited States of America":;;42 Plantation St.;Baytown;LA;30314;United State
s of America
EMAIL:forrestgump@example.com
REV:20080424T195243Z
x-qq:21588891
END:VCARD`

// Format 2.1 used for v3
var testInvalidv3 = `begin:vcard
fn:Emma
email;internet:Emma@tomme.de.savoie
version:3.0
end:vcard
`

var validTests = []struct {
	s string
}{
	{testWikipediav3},
	{testWikipediav4},
}

var invalidFormat = []struct {
	s string
}{
	{testWikipediav2_1},
}

func TestFromVcardValid(t *testing.T) {
	info := objects.UserInfo{User_id: "ede04443-b60f-4869-9040-20bd6b1e33c1"}
	for _, test := range validTests {
		r := strings.NewReader(test.s)
		cards, err := ParseVcardFile(r)
		if len(cards) != 1 {
			t.Error("Expected only one vcard")
		}
		contact, err := FromVcard(&info, cards[0])
		if err != nil {
			t.Error("Expecting null error ", err)
		}
		if len(contact.Emails) == 0 {
			t.Error("No email found in test vcard ")
		}
		if len(contact.Phones) == 0 {
			t.Error("No phone found in test vcard ")
		}
	}
}

func TestFromVcardInvalid(t *testing.T) {
	info := objects.UserInfo{User_id: "ede04443-b60f-4869-9040-20bd6b1e33c1"}
	for _, test := range invalidFormat {
		r := strings.NewReader(test.s)
		cards, err := ParseVcardFile(r)
		if len(cards) != 1 {
			t.Error("Expected only one vcard")
		}
		_, err = FromVcard(&info, cards[0])
		if err == nil {
			t.Error("Expecting not null error ")
		}
	}
}

// Test testInvalidv3 card
func TestFromVcardInvalidEmailFormat(t *testing.T) {
	info := objects.UserInfo{User_id: "ede04443-b60f-4869-9040-20bd6b1e33c1"}
	r := strings.NewReader(testInvalidv3)
	cards, err := ParseVcardFile(r)
	if len(cards) != 1 {
		t.Error("Expected only one vcard")
	}
	contact, err := FromVcard(&info, cards[0])
	if err != nil {
		t.Error("Expecting no error ")
	}
	if len(contact.Emails) > 0 {
		t.Error("Expecting no email in invalid vcard")
	}
}
