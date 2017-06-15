package objects

import (
	"bytes"
	"net/mail"
)

type (
	// EmailMessage is a wrapper to handle the relationship
	// between a raw email, its json representation and its Caliopen message counterpart
	EmailMessage struct {
		Email      *Email
		Email_json *EmailJson
		Message    *Message
	}

	//email is a basic container to handle incoming & outcoming raw emails.
	Email struct {
		SmtpMailFrom []string     // from or for the smtp agent
		SmtpRcpTo    []string     // from or for the smtp agent
		Raw          bytes.Buffer // raw email (without the Bcc header)
		//TODO: add more infos from mta
	}

	//json representation of a parsed raw email.
	EmailJson struct {
		Addresses      []EmailAddress      // all email addresses extracted from address fields
		Date           string              // the exact string found. No treatment at all
		Envelope       Envelope            // smtp envelope from MTA
		Headers        map[string][]string // repeated headers are grouped into one
		Html           string              // html body mime part, if any
		IsTextFromHTML bool                // plain text was empty; down-converted HTML
		MimeRoot       MimeRoot            // the top level mime part, if any
		Plain          string              // plain text body
		Subject        string
	}

	EmailAddress struct {
		Addr  mail.Address
		Field string // To, From, etc. = field where email address was
	}

	Envelope struct {
		To          []string // the email addresses the server is sending to.
		Recipients  []string // the full list of recipients that the remote server is attempting to send to.
		From        []string // the email addresses that the server was sending from.
		Helo_domain string   // the domaine reported by the sending server
		Remote_ip   string   // the remote IP address of the sending server
		Spf         string   // the SPF result for the given IP address and domain
	}

	//struct to hold mime parts logic
	MimeRoot struct {
		Attachments_count int
		Root_boundary     string
		Inline_count      int
		Parts             []Part
	}

	Part struct {
		Boundary      string
		Charset       string
		Content       []byte
		ContentType   string
		Headers       map[string][]string
		Is_attachment bool
		Is_inline     bool
		Parts         []Part
	}
)
