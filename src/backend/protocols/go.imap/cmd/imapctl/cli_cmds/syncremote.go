/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/Sirupsen/logrus"
	"github.com/nats-io/go-nats"
	"github.com/spf13/cobra"
)

var (
	syncRemoteCmd = &cobra.Command{
		Use:   "syncremote",
		Short: "sync remote mailbox for provided remote identity",
		Run:   syncRemote,
	}
)

func init() {
	syncRemoteCmd.Flags().StringVarP(&id.UserId, "userid", "u", "", "remote identity's user id (required)")
	syncRemoteCmd.Flags().StringVarP(&id.Identifier, "identifier", "i", "", "remote identity's identifier (required)")
	syncRemoteCmd.Flags().StringVarP(&id.Password, "pass", "p", "", "IMAP password (if not stored in db)")
	syncRemoteCmd.MarkFlagRequired("userid")
	syncRemoteCmd.MarkFlagRequired("identifier")
	RootCmd.AddCommand(syncRemoteCmd)
}

func syncRemote(cmd *cobra.Command, args []string) {

	nc, err := nats.Connect(cmdConfig.NatsUrl)
	if err != nil {
		logrus.WithError(err).Fatal("nats connect failed")
	}
	defer nc.Close()

	msg, err := json.Marshal(IMAPfetchOrder{
		Order:      "sync",
		UserId:     id.UserId,
		Identifier: id.Identifier,
		Server:     id.Server,
		Mailbox:    id.Mailbox,
		Login:      id.Login,
		Password:   id.Password,
	})
	if err != nil {
		logrus.WithError(err).Fatal("unable to marshal natsOrder")
	}

	nc.Publish(cmdConfig.NatsTopic, msg)
	nc.Flush()

	if err := nc.LastError(); err != nil {
		logrus.WithError(err).Fatal("nats publish failed")
	}

	logrus.Infof("ordering to sync mailbox from %s for user %s", id.Identifier, id.UserId)
}
