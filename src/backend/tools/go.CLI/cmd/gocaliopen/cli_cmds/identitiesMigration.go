// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cmd

import (
	"context"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/REST"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/satori/go.uuid"
	"github.com/spf13/cobra"
	"gopkg.in/olivere/elastic.v5"
	"io"
	"time"
)

var identitiesMigrationCmd = &cobra.Command{
	Use:   "identitiesMigration",
	Short: "manage db and index migration for new model UserIdentity",
	Long: `command merges LocalIdentities and RemoteIdentities into new UserIdentities,
	builds lookup tables, then iterates over all messages in db and index to replace identities by user_identities`,
	Run: identitiesMigration,
}

func init() {
	RootCmd.AddCommand(identitiesMigrationCmd)
}

func identitiesMigration(cmd *cobra.Command, args []string) {
	var err error
	//check/get connexions to facilities
	//store
	var Store *store.CassandraBackend
	Store, err = getStoreFacility()
	if err != nil {
		log.WithError(err).Fatalf("initialization of %s backend failed", apiConf.BackendName)
	}
	defer Store.Close()
	//index
	var Index *index.ElasticSearchBackend
	Index, err = getIndexFacility()
	if err != nil {
		log.WithError(err).Fatalf("initialization of %s index failed", apiConf.IndexConfig.IndexName)
	}
	defer Index.Close()

	var Rest *REST.RESTfacility
	Rest, err = getRESTFacility()
	if err != nil {
		log.WithError(err).Fatal("initialization of ReST facility failed")
	}

	/* get all users id */
	erroneousUsers := []string{}
	erroneousMessages := []string{}
	if users, err := Store.Session.Query(`SELECT user_id, local_identities FROM user`).Iter().SliceMap(); err != nil {
		log.WithError(err).Fatal("failed to retrieve user ids")
	} else {
		log.Infof("\nFound %d users to work with\n", len(users))
		for _, user := range users {
			var userId UUID
			userId.UnmarshalBinary([]byte(user["user_id"].(string)))
			var localId UUID

			localId, err := createLocal(user, Store, erroneousUsers, userId, Rest)
			if err != nil {
				continue
			}

			if err := createRemote(user, Store, erroneousUsers, userId, Rest); err != nil {
				continue
			}

			if err := updateSentMessages(Store, Index, userId, Rest, erroneousMessages, localId); err != nil {
				continue
			}
		}
		log.Info("\nAll done\n")
		if len(erroneousUsers) > 0 {
			log.Warnf("Users with errors : %v", erroneousUsers)
		}
		if len(erroneousMessages) > 0 {
			log.Warnf("Messages with errors : %v", erroneousMessages)
		}
	}
}

func createLocal(user map[string]interface{}, Store *store.CassandraBackend, erroneousUsers []string, userId UUID, Rest *REST.RESTfacility) (localId UUID, err error) {
	var local map[string]interface{}
	identifier := user["local_identities"].([]interface{})
	err = Store.Session.Query(`SELECT * FROM local_identity WHERE identifier = ?`, identifier[0].(string)).MapScan(local)
	if err != nil {
		log.WithError(err).Warnf("failed to retrieve local identity '%s' for user %s", identifier[0], userId.String())
		erroneousUsers = append(erroneousUsers, userId.String())
		return
	}
	uid := new(UUID)
	err = uid.UnmarshalBinary(uuid.NewV4().Bytes())
	if err != nil {
		log.WithError(err).Warnf("failed to create uuid for local identity for user %s", userId.String())
		erroneousUsers = append(erroneousUsers, userId.String())
		return
	}
	localUser := UserIdentity{
		DisplayName: local["display_name"].(string),
		Id:          *uid,
		Identifier:  local["identifier"].(string),
		Protocol:    "smtp",
		Status:      "active",
		Type:        "local",
		UserId:      userId,
	}
	caliopenErr := Rest.CreateUserIdentity(&localUser)
	if caliopenErr != nil {
		log.WithError(caliopenErr).Warnf("failed to save local identity %v for user %s", localUser, userId.String())
		erroneousUsers = append(erroneousUsers, userId.String())
		return
	}
	return *uid, nil
}

func createRemote(user map[string]interface{}, Store *store.CassandraBackend, erroneousUsers []string, userId UUID, Rest *REST.RESTfacility) (err error) {
	remotes, err := Store.Session.Query(`SELECT * from remote_identity WHERE user_id = ?`, userId.String()).Iter().SliceMap()
	if err != nil {
		log.WithError(err).Warnf("failed to retrieve remote identities for user %s", userId.String())
		erroneousUsers = append(erroneousUsers, userId.String())
		return
	}
	for _, remote := range remotes {
		uid := new(UUID)
		err = uid.UnmarshalBinary(uuid.NewV4().Bytes())
		if err != nil {
			log.WithError(err).Warnf("failed to create uuid for remote identity for user %s", userId.String())
			erroneousUsers = append(erroneousUsers, userId.String())
			continue
		}
		remoteID := new(UserIdentity)
		remoteID.NewEmpty()
		if credentials, ok := remote["credentials"]; ok && credentials != nil {
			cred := &Credentials{}
			cred.UnmarshalCQLMap(credentials.(map[string]string))
			remoteID.Credentials = cred
		}
		if dn, ok := remote["display_name"].(string); ok {
			remoteID.DisplayName = dn
		}

		if infos, ok := remote["infos"].(map[string]string); ok {
			remoteID.Infos = make(map[string]string)
			for k, v := range infos {
				remoteID.Infos[k] = v
			}
		}
		if lc, ok := remote["last_check"].(time.Time); ok {
			remoteID.LastCheck = lc
		}
		if remote_id, ok := remote["remote_id"].(gocql.UUID); ok {
			remoteID.Id.UnmarshalBinary(remote_id.Bytes())
		}
		if status, ok := remote["status"].(string); ok {
			remoteID.Status = status
		}
		if t, ok := remote["type"].(string); ok {
			remoteID.Type = t
		}
		if userid, ok := remote["user_id"].(gocql.UUID); ok {
			remoteID.UserId.UnmarshalBinary(userid.Bytes())
		}
		caliopenErr := Rest.CreateUserIdentity(remoteID)
		if caliopenErr != nil {
			log.WithError(caliopenErr).Warnf("failed to save remote identity %v for user %s", *remoteID, userId.String())
			erroneousUsers = append(erroneousUsers, userId.String())
			continue
		}
	}
	return nil
}

func updateSentMessages(Store *store.CassandraBackend, Index *index.ElasticSearchBackend, userId UUID, Rest *REST.RESTfacility, erroneousMessages []string, localId UUID) error {
	/* get all sent messages id for user from index */
	scroll := Index.Client.Search().Index(userId.String()).Type(MessageIndexType).
		Query(elastic.NewTermsQuery("is_received", false)).
		FetchSource(false).
		Size(100)
	for {
		results, err := scroll.Do(context.TODO())
		if err == io.EOF {
			break // all results retrieved for this user
		}
		if err != nil {
			// something went wrong
			log.WithError(err).Warnf("failed to scroll over indexed messages for user %s", userId.String())
			return err
		}
		for _, hit := range results.Hits.Hits {
			message, err := Rest.GetMessage(userId.String(), hit.Id)
			if err != nil {
				continue
			}
			userIdentities := []UUID{localId}
			updatedFields := map[string]interface{}{"UserIdentities": userIdentities}
			message.UserIdentities = userIdentities
			err = Store.UpdateMessage(message, updatedFields)
			if err != nil {
				log.WithError(err).Warnf("failed to update message %s in db", hit.Id)
				erroneousMessages = append(erroneousMessages, userId.String())
			}
			err = Index.UpdateMessage(message, updatedFields)
			if err != nil {
				log.WithError(err).Warnf("failed to update message %s in index", hit.Id)
				erroneousMessages = append(erroneousMessages, userId.String())
			}
		}
	}
	return nil
}
