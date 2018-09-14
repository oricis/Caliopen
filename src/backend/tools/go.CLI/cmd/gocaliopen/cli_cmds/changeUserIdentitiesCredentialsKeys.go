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

var credentialsKeysMigrationCmd = &cobra.Command{
	Use:   "credentialsKeysMigration",
	Short: "rename keys in UserIdentity.Infos and .Credentials to conform to new specs",
	Long: `command updates keys name to conform to new specs after branch "imap-outbound" has been merged in prod"`,
	Run: credentialsKeysMigration,
}

func init() {
	RootCmd.AddCommand(credentialsKeysMigrationCmd)
}

func credentialsKeysMigration(cmd *cobra.Command, args []string) {
	var err error
	//check/get connexions to facilities
	//store
	var Store *store.CassandraBackend
	Store, err = getStoreFacility()
	if err != nil {
		log.WithError(err).Fatalf("initialization of %s backend failed", apiConf.BackendName)
	}
	defer Store.Close()

	/* get all remote_identities */
	erroneousUsers := []string{}
	if lookups, err := Store.Session.Query(`SELECT * FROM identity_type_lookup WHERE type='remote'`).Iter().SliceMap(); err != nil {
		log.WithError(err).Fatal("failed to retrieve remote identities")
	} else {
		log.Infof("\nFound %d identities to work with\n", len(lookups))
		for _, lookup := range lookups {
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
			updateInfos := map[string]string{}
			updateCredentials := objects.Credentials{}

			//copy values from infos' map but `server` key
			for k,v := range userIdentity.Infos {
				if k == "server" {
					updateInfos["inserver"] = v
				} else if k != "inserver"{
					updateInfos[k] = v
				}
			}

			//copy values from credentials' map but `password` and `username`
			if userIdentity.Credentials != nil {
				for k, v := range *userIdentity.Credentials {
					if k == "password" {
						updateCredentials["inpassword"] = v
					} else if k == "username" {
						updateCredentials["inusername"] = v
					} else {
						updateCredentials[k] = v
					}
				}
			}

			updateFields["Infos"] = updateInfos
			updateFields["Credentials"] = &updateCredentials

			err = Store.UpdateUserIdentity(userIdentity, updateFields)
			if err != nil {
				log.Warnf("failed to update identity <%s> for user <%s>", userIdentity.Id.String(), userIdentity.UserId.String())
			}
		}
		log.Info("\nAll done\n")
		if len(erroneousUsers) > 0 {
			log.Warnf("Users with errors : %v", erroneousUsers)
		}
	}
}

