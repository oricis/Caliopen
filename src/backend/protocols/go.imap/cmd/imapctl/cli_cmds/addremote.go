/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"github.com/spf13/cobra"
)

var (
	id           remoteId
	addRemoteCmd = &cobra.Command{
		Use:   "addremote",
		Short: "add an IMAP remote identity for specified user",
		Run:   addRemote,
	}
)

type remoteId struct {
	DisplayName  string
	Identifier   string
	Login        string
	Mailbox      string
	Password     string
	PollInterval string
	Server       string
	UserId       string
}

func init() {
	//mandatory
	addRemoteCmd.Flags().StringVarP(&id.UserId, "userid", "u", "", "user account uuid in which mails will be imported (required)")
	addRemoteCmd.Flags().StringVarP(&id.Server, "server", "s", "", "remote hostname[:port] IMAP server address (required)")
	addRemoteCmd.Flags().StringVarP(&id.Login, "login", "l", "", "IMAP login credential (required)")
	//optional
	addRemoteCmd.Flags().StringVarP(&id.Password, "pass", "p", "", "IMAP password credential")
	addRemoteCmd.Flags().StringVarP(&id.Mailbox, "mailbox", "m", "INBOX", "IMAP mailbox name to fetch mail from (case sensitive, default to 'INBOX'")
	addRemoteCmd.Flags().StringVarP(&id.Identifier, "identifier", "i", id.Login, "identifier for remote identity (default to login)")
	addRemoteCmd.Flags().StringVarP(&id.DisplayName, "display", "d", "", "display name for remote identity")
	addRemoteCmd.MarkFlagRequired("userid")
	addRemoteCmd.MarkFlagRequired("server")
	addRemoteCmd.MarkFlagRequired("login")
	RootCmd.AddCommand(addRemoteCmd)
}

func addRemote(cmd *cobra.Command, args []string) {
	var is backends.IdentityStorage
	var rId RemoteIdentity
	var err error
	switch cmdConfig.StoreName {
	case "cassandra":
		c := store.CassandraConfig{
			Hosts:       cmdConfig.StoreConfig.Hosts,
			Keyspace:    cmdConfig.StoreConfig.Keyspace,
			Consistency: gocql.Consistency(cmdConfig.StoreConfig.Consistency),
			SizeLimit:   cmdConfig.StoreConfig.SizeLimit,
		}

		is, err = store.InitializeCassandraBackend(c)
		if err != nil {
			log.WithError(err).Fatalf("[addRemote] initalization of %s backend failed", cmdConfig.StoreName)
		}

	}
	if id.Identifier == "" {
		id.Identifier = id.Login
	}
	if id.DisplayName == "" {
		id.DisplayName = id.Identifier
	}
	rId = RemoteIdentity{
		DisplayName: id.DisplayName,
		Identifier:  id.Identifier,
		Status:      "active",
		Type:        "imap",
		UserId:      UUID(uuid.FromStringOrNil(id.UserId)),
	}
	rId.SetDefaultInfos()
	rId.Infos["password"] = id.Password
	rId.Infos["server"] = id.Server
	rId.Infos["username"] = id.Login

	err = is.CreateRemoteIdentity(&rId)
	if err != nil {
		log.WithError(err).Warn("[addRemote] storage failed to store remote identity")
	} else {
		log.Info("OK, new remote identity added ! Bye.")
	}
}
