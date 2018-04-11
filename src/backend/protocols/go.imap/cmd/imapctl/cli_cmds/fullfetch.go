/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"encoding/json"
	"github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"github.com/spf13/cobra"
)

var (
	fullFetchCmd = &cobra.Command{
		Use:   "fullfetch",
		Short: "blindly imports all mails from a remote IMAP mailbox into user's account.",
		Run:   fullFetch,
	}
)

type natsOrder struct {
	Order string
	remoteId
}

func init() {
	fullFetchCmd.Flags().StringVarP(&id.UserId, "userid", "u", "", "user account uuid in which mails will be imported (required)")
	fullFetchCmd.Flags().StringVarP(&id.Server, "server", "s", "", "remote hostname[:port] IMAP server address (required)")
	fullFetchCmd.Flags().StringVarP(&id.Mailbox, "mailbox", "m", "INBOX", "IMAP mailbox name to fetch mail from, case sensitive")
	fullFetchCmd.Flags().StringVarP(&id.Login, "login", "l", "", "IMAP login credential (required)")
	fullFetchCmd.Flags().StringVarP(&id.Password, "pass", "p", "", "IMAP password credential (required)")
	fullFetchCmd.MarkFlagRequired("userid")
	fullFetchCmd.MarkFlagRequired("server")
	fullFetchCmd.MarkFlagRequired("login")
	fullFetchCmd.MarkFlagRequired("pass")
	RootCmd.AddCommand(fullFetchCmd)
}

// fullFetch
func fullFetch(cmd *cobra.Command, args []string) {

	nc, err := nats.Connect(cmdConfig.NatsUrl)
	if err != nil {
		logrus.WithError(err).Fatal("nats connect failed")
	}
	defer nc.Close()

	msg, err := json.Marshal(natsOrder{"fullfetch", id})
	if err != nil {
		logrus.WithError(err).Fatal("unable to marshal natsOrder")
	}

	nc.Publish(cmdConfig.NatsTopic, msg)
	nc.Flush()

	if err := nc.LastError(); err != nil {
		logrus.WithError(err).Fatal("nats publish failed")
	}

	logrus.Infof("ordering to fetch all mails from %s for user %s", id.Server, id.UserId)
}
