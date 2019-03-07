// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package imap_worker

import (
	"crypto/tls"
	"encoding/base64"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/backendstest"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/helpers"
	"github.com/emersion/go-imap"
	"github.com/satori/go.uuid"
	"reflect"
	"strings"
	"testing"
	"time"
)

// NB : as of february'19 IMAP commands are not tested yet

func Test_buildXheaders(t *testing.T) {
	tlsConn := helpers.GetTestTlsConn()
	userIdentity := &UserIdentity{}
	box := &imapBox{}
	message := &imap.Message{}
	provider := Provider{}
	type params struct {
		c *tls.Conn
		u *UserIdentity
		i *imapBox
		m *imap.Message
		p Provider
	}
	connState := tlsConn.ConnectionState()

	data := []struct {
		in  params
		out ImapFetcherHeaders
	}{
		{
			in: params{tlsConn, userIdentity, box, message, provider},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "",
				"X-Fetched-Imap-Box":     "",
				"X-Fetched-Imap-For":     "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":     "0",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, userIdentity, box, message, Provider{Capabilities: map[string]bool{"IMAP4rev1": true}}},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "",
				"X-Fetched-Imap-Box":     "",
				"X-Fetched-Imap-For":     "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":     "0",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "with IMAP4rev1 protocol", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, &UserIdentity{
				DisplayName: "account name",
				UserId:      UUID(uuid.FromStringOrNil(backendstest.EmmaTommeUserId)),
			}, box, message, provider},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "account name",
				"X-Fetched-Imap-Box":     "",
				"X-Fetched-Imap-For":     uuid.FromStringOrNil(backendstest.EmmaTommeUserId).String(),
				"X-Fetched-Imap-Uid":     "0",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, userIdentity, &imapBox{name: "box name"}, message, provider},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "",
				"X-Fetched-Imap-Box":     base64.StdEncoding.EncodeToString([]byte("box name")),
				"X-Fetched-Imap-For":     "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":     "0",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, userIdentity, box, &imap.Message{Uid: 999}, provider},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "",
				"X-Fetched-Imap-Box":     "",
				"X-Fetched-Imap-For":     "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":     "999",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, userIdentity, box, &imap.Message{Flags: []string{"flag1", "flag2"}}, provider},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "",
				"X-Fetched-Imap-Box":     "",
				"X-Fetched-Imap-For":     "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":     "0",
				"X-Fetched-Imap-Flags":   base64.StdEncoding.EncodeToString([]byte("flag1\r\nflag2")),
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, userIdentity, box, message, Provider{Name: "gmail"}},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account": "",
				"X-Fetched-Imap-Box":     "",
				"X-Fetched-Imap-For":     "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":     "0",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
		{
			in: params{tlsConn, userIdentity, box, &imap.Message{Items: map[imap.FetchItem]interface{}{
				imap.FetchItem(gmail_msgid):  "gmail message-id",
				imap.FetchItem(gmail_labels): []interface{}{`\Inbox`, `Important`, `Très Important`},
			}}, Provider{Name: "gmail"}},
			out: ImapFetcherHeaders{
				"X-Fetched-Imap-Account":    "",
				"X-Fetched-Imap-Box":        "",
				"X-Fetched-Imap-For":        "00000000-0000-0000-0000-000000000000",
				"X-Fetched-Imap-Uid":        "0",
				"X-Fetched-" + gmail_msgid:  "gmail message-id",
				"X-Fetched-" + gmail_labels: "XEluYm94DQpJbXBvcnRhbnQNClRyw6hzIEltcG9ydGFudA==",
				"X-Fetched-Imap": fmt.Sprintf(`from %s ([%s])
        (using %s with cipher %s)
        by imap-fetcher (Caliopen) %s;
        %s`, "", tlsConn.RemoteAddr().String(), TlsVersions[connState.Version], TlsSuites[connState.CipherSuite], "", time.Now().Format(time.RFC1123Z)),
			},
		},
	}

	for i, set := range data {
		result := buildXheaders(set.in.c, set.in.u, set.in.i, set.in.m, set.in.p)
		if !reflect.DeepEqual(result, set.out) {
			t.Errorf("invalid headers for set %d.\nExpected : %+v\nGot : %+v", i, set.out, result)
		}
	}
}

func TestMarshalImap(t *testing.T) {
	message := imap.NewMessage(42, []imap.FetchItem{imap.FetchBody, imap.FetchFlags})
	const mailBody = "mail body"
	const headerKey = "x-test-header"
	const headerValue = "test-header-value"
	message.Body = map[*imap.BodySectionName]imap.Literal{&imap.BodySectionName{}: strings.NewReader(mailBody)}
	xHeaders := map[string]string{headerKey: headerValue}
	email, err := MarshalImap(message, xHeaders)
	if err != nil {
		t.Error(err)
	}
	// expect xHeaders added at head of email's bytes.Buffer
	s := headerKey + ": " + headerValue + "\r\n" + mailBody
	if s != email.Raw.String() {
		t.Errorf("MarshalImap failed to build expected email, expected :\n%s\ngot :\n%s\n", s, email.Raw.String())
	}

}
