package main

import (
	"fmt"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/gomail.v2"
	"net/smtp"
	"sync"
	"time"
)

const (
	URL = "127.0.0.1:2525"
)

func lastWords(message string, err error) {
	fmt.Println(message, err.Error())
	// panic(err)
}

// Sends a SMTP email x times, for testing.
func main() {
	log.WithFields(log.Fields{"time": time.Now().Format(time.RFC3339Nano)}).Info("start sending mails")
	wg := sync.WaitGroup{}
	count := 1
	wg.Add(count)
	for i := 0; i < count; i++ {
		go sendMail(i, &wg)
	}
	wg.Wait()
	log.WithFields(log.Fields{"time": time.Now().Format(time.RFC3339Nano)}).Info("end sending mails")
}

func sendMail(i int, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Printf("Sending mail #%d\n", i)
	c, err := smtp.Dial(URL)
	if err != nil || c == nil {
		lastWords("Dial ", err)
		return
	}
	defer c.Close()

	from := "st@nisl.as"
	to := "dev@caliopen.local"
	to2 := ""

	if err = c.Mail(from); err != nil {
		lastWords("Mail ", err)
		return
	}

	if err = c.Rcpt(to); err != nil {
		lastWords("Rcpt ", err)
		return
	}

	if to2 != "" {
		if err = c.Rcpt(to2); err != nil {
			lastWords("Rcpt ", err)
			return
		}
	}

	wr, err := c.Data()
	if err != nil {
		lastWords("Data ", err)
		return
	}
	defer wr.Close()

	m := gomail.NewMessage()
	m.SetAddressHeader("From", "st@nisl.as", "Stan")
	m.SetAddressHeader("To", "dev@caliopen.local", "")
	m.SetDateHeader("Date", time.Now())
	m.SetHeader("Subject", "Subject line for testing")
	m.SetBody("text/plain", "Body hello from Stan.\n")
	m.Attach("/Users/stan/Downloads/LE-GOUT-DES-MATHS.pdf")

	_, err = m.WriteTo(wr)
	if err != nil {
		lastWords("Send ", err)
		return
	}

	err = c.Quit()
	if err != nil {
		lastWords("Quit ", err)
		return
	}
	fmt.Printf("Finished sending mail #%d\n", i)
}
