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
	"errors"
	"fmt"
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
	"github.com/spf13/cobra"
	"os"
	"strings"
	"time"
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
	//nats
	var MsgQueue *nats.Conn
	MsgQueue, err = getMsgSystemFacility()
	if err != nil {
		log.WithError(err).Fatal("initiazation of message queue failed")
	}

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
		if err != nil && !strings.Contains(err.Error(), "Not Found") {
			log.Warn(err)
			failedCount++
			return
		}
		if result != nil && result.Found {
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
				fixedCount++
				return
			}
		}
		log.Infoln("failed to retrieve participant from index, trying to reinject raw message")
		var newMsgId string
		newMsgId, err = reInjectRaw(usrId.String(), rawMsgId.String(), MsgQueue)
		if err != nil {
			log.WithError(err).Warn("failed to re-inject raw message in stack")
			failedCount++
			return
		}
		//reinjection OK, get previous status and delete former invalid message
		formerMsg, err := Store.RetrieveMessage(usrId.String(), msgId.String())
		if err == nil {
			newMsg, err := Store.RetrieveMessage(usrId.String(), newMsgId)
			if err == nil {
				err = Store.UpdateMessage(newMsg, map[string]interface{}{
					"Date_sort":   formerMsg.Date_sort,
					"Is_answered": formerMsg.Is_answered,
					"Is_unread":   formerMsg.Is_unread,
					"Tags":        formerMsg.Tags,
				})
				if err != nil {
					log.WithError(err).Warnf("failed to update new message with former status %s", msgId)
				}
			}
		}
		err = Store.Session.Query(`DELETE FROM message WHERE message_id = ? AND user_id = ?`, msgId, usrId).Exec()
		if err != nil {
			log.WithError(err).Warnf("failed to delete former invalid message %s", msgId)
		}
		fixedCount++

	}

	//get an iterator on table message and iterate over all messages
	Store.Session.SetTrace(gocql.NewTraceWriter(Store.Session, os.Stdout))
	Store.Session.Query(`SELECT count(*) FROM message`).Scan(&total)
	msgIterator := Store.Session.Query(`SELECT message_id, user_id, raw_msg_id, participants FROM message`).PageSize(500).NoSkipMetadata().Iter()
	if msgIterator == nil {
		log.Fatal("fail to get iterator on table message")
	}
	var msgId gocql.UUID
	var usrId gocql.UUID
	var rawMsgId gocql.UUID
	var participants []map[string]interface{}
	for msgIterator.Scan(&msgId, &usrId, &rawMsgId, &participants) {
		count++
		if len(msgIterator.Warnings()) > 0 {
			log.Info(msgIterator.Warnings())
		}
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

func reInjectRaw(userId, msgId string, msgQueue *nats.Conn) (newMsgId string, err error) {
	const nats_message_tmpl = "{\"order\":\"process_raw\",\"user_id\": \"%s\", \"message_id\": \"%s\"}"
	natsMessage := fmt.Sprintf(nats_message_tmpl, userId, msgId)

	resp, err := msgQueue.Request(lmtpConf.LDAConfig.InTopic, []byte(natsMessage), 10*time.Second)
	if err != nil {
		if msgQueue.LastError() != nil {
			log.WithError(msgQueue.LastError()).Warnf("[EmailBroker] failed to publish inbound request on NATS for user %s", userId)
			log.Infof("natsMessage: %s\nnatsResponse: %+v\n", natsMessage, resp)
			return
		} else {
			log.WithError(err).Warnf("[EmailBroker] failed to publish inbound request on NATS for user %s", userId)
			log.Infof("natsMessage: %s\nnatsResponse: %+v\n", natsMessage, resp)
			return
		}
	}

	nats_ack := new(map[string]interface{})
	err = json.Unmarshal(resp.Data, &nats_ack)
	if err != nil {
		log.WithError(err).Warnf("[EmailBroker] failed to parse inbound ack on NATS for user %s", userId)
		log.Infof("natsMessage: %s\nnatsResponse: %+v\n", natsMessage, resp)
		return
	}
	if e, ok := (*nats_ack)["error"]; ok {
		log.WithError(errors.New(e.(string))).Warnf("[EmailBroker] inbound delivery failed for user %s", userId)
		log.Infof("natsMessage: %s\nnatsResponse: %+v\n", natsMessage, resp)
		err = errors.New(e.(string))
		return
	}

	newMsgId = (*nats_ack)["message_id"].(string)
	return
}
