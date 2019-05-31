package contact

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"strings"
	"testing"
)

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

var validTests = []struct {
	s string
}{
	{testWikipediav3},
	{testWikipediav4},
}

func TestFromVcard(t *testing.T) {
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
