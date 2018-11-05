// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cmd

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/spf13/cobra"
)

var emailProtocolCmd = &cobra.Command{
	Use:   "changeIdentityEmailProtocol",
	Short: "rename protocol from `imap`|`smtp` to `email` in UserIdentity",
	Long:  `command updates protocol name for email to conform to new specs`,
	Run:   emailProtocolMigration,
}

func init() {
	RootCmd.AddCommand(emailProtocolCmd)
}

func emailProtocolMigration(cmd *cobra.Command, args []string) {
	var err error
	//check/get connexions to facilities
	//store
	var Store *store.CassandraBackend
	Store, err = getStoreFacility()
	if err != nil {
		log.WithError(err).Fatalf("initialization of %s backend failed", apiConf.BackendName)
	}
	defer Store.Close()

	/* get all identities */
	erroneousUsers := []string{}
	if lookups, err := Store.Session.Query(`SELECT user_id, identity_id, protocol FROM user_identity`).Iter().SliceMap(); err != nil {
		log.WithError(err).Fatal("failed to retrieve remote identities")
	} else {
		log.Infof("\nFound %d identities to work with\n", len(lookups))
		for _, lookup := range lookups {
			if lookup["protocol"].(string) == objects.SmtpProtocol || lookup["protocol"].(string) == objects.ImapProtocol {
				var userId string
				var remoteId string
				userId = lookup["user_id"].(gocql.UUID).String()
				remoteId = lookup["identity_id"].(gocql.UUID).String()

				userIdentity, err := Store.RetrieveUserIdentity(userId, remoteId, true)

				if err != nil {
					log.WithError(err).Warnf("failed to retrieve identity <%s> for user <%s>", userId, remoteId)
					continue
				}

				updateFields := map[string]interface{}{}
				userIdentity.Protocol = objects.EmailProtocol
				updateFields["Protocol"] = objects.EmailProtocol

				err = Store.UpdateUserIdentity(userIdentity, updateFields)
				if err != nil {
					log.Warnf("failed to update identity <%s> for user <%s>", userIdentity.Id.String(), userIdentity.UserId.String())
				} else {
					Store.Session.Query(`DELETE FROM identity_lookup WHERE identifier = ? AND protocol = ? AND user_id = ?`, userIdentity.Identifier, lookup["protocol"].(string), userIdentity)
				}

			}
		}
		log.Info("\nAll done\n")
		if len(erroneousUsers) > 0 {
			log.Warnf("Users with errors : %v", erroneousUsers)
		}
	}
}
