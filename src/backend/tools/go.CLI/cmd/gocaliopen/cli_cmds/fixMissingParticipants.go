/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"context"
	"encoding/json"
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/spf13/cobra"
)

// fixMissingParticipantsCmd represents the fixMissingParticipants command
var fixMissingParticipantsCmd = &cobra.Command{
	Use:   "fixMissingParticipants",
	Short: "Fill missing message.participants in db and index",
	Long: `This command iterates over all messages in cassandra to find messages that miss participants.
	If message.participants exists in index, db version is filled with it.
	If not, command will reinject raw_message in stack to trigger again message inbound processing.`,
	Run: fixMissingParticipants,
}

func init() {
	RootCmd.AddCommand(fixMissingParticipantsCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// fixMissingParticipantsCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// fixMissingParticipantsCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

func fixMissingParticipants(cmd *cobra.Command, args []string) {
	var err error
	//check/get connexions to facilities
	//store
	var Store *store.CassandraBackend
	Store, err = getStoreFacility()
	if err != nil {
		log.WithError(err).Fatalf("initalization of %s backend failed", apiConf.BackendName)
	}
	defer Store.Close()
	//index
	var Index *index.ElasticSearchBackend
	Index, err = getIndexFacility()
	if err != nil {
		log.WithError(err).Fatalf("initalization of %s index failed", apiConf.IndexConfig.IndexName)
	}
	defer Index.Close()

	var total int
	count := 0
	invalidCount := 0
	fixedCount := 0
	failedCount := 0
	//
	handleInvalidMessage := func(msgId, usrId, rawMsgId gocql.UUID) {
		invalidCount++
		//try to fetch message from index and check if it has participants
		result, err := Index.Client.Get().Index(usrId.String()).Type(objects.MessageIndexType).Id(msgId.String()).Do(context.TODO())
		if err != nil {
			log.Warn(err)
			failedCount++
			return
		}
		msg := new(objects.Message).NewEmpty().(*objects.Message)
		if err := json.Unmarshal(*result.Source, msg); err != nil {
			log.Warn(err)
			failedCount++
			return
		}
		err = msg.Message_id.UnmarshalBinary(msgId.Bytes())
		if err != nil {
			log.WithError(err).Warn("failed to unmarshal messageId")
			failedCount++
			return
		}
		if msg.Participants != nil && len(msg.Participants) > 0 {
			err = Store.UpdateMessage(msg, map[string]interface{}{
				"Participants": msg.Participants,
			})
			if err != nil {
				log.WithError(err).Warnf("failed to update message in db")
				failedCount++
				return
			}
		} else {
			log.Infoln("no participant found in index, trying to reinject raw message")
			//TODO
			failedCount++
			return
		}

		//if fix from index failed, try to rebuild participants from raw_msg
		log.Infoln("message not found in index, trying to reinject raw message")
		//TODO
		fixedCount++
	}

	//get an iterator on table message and iterate over all messages
	Store.Session.Query(`SELECT count(*) FROM message`).Scan(&total)
	msgIterator := Store.Session.Query(`SELECT message_id, user_id, raw_msg_id, participants FROM message`).Iter()
	if msgIterator == nil {
		log.Fatal("fail to get iterator on table message")
	}
	var msgId gocql.UUID
	var usrId gocql.UUID
	var rawMsgId gocql.UUID
	var participants []map[string]interface{}
	for msgIterator.Scan(&msgId, &usrId, &rawMsgId, &participants) {
		count++
		if len(participants) == 0 {
			handleInvalidMessage(msgId, usrId, rawMsgId)
		}
	}
	msgIterator.Close()
	if count < total {
		log.Warnf("for some reason, only %d messages have been scan, out of %d", count, total)
	} else {
		log.Infof("%d messages scanned", count)
	}
	log.Infof("%d invalid messages handled => %d fixed, %d failed", invalidCount, fixedCount, failedCount)

}
