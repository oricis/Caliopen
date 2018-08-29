/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package imap_worker

import (
	"encoding/json"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/nats-io/go-nats"
	"testing"
)

func TestSendFetchNatsOrder(t *testing.T) {
	nc, err := nats.Connect("nats://nats:4222")
	if err != nil {
		t.Fatal(err)
	}
	defer nc.Close()

	order := IMAPorder{
		Order:    "fetch",
		UserId:   "2b68fc50-f6e2-4c3a-b81c-50c5a3de594e",
		RemoteId: "user@remote.imap",
	}

	o, _ := json.Marshal(order)

	msg := &nats.Msg{Subject: "IMAPfetcher", Data: o}
	err = nc.PublishMsg(msg)
	if err != nil {
		t.Error(err)
	}

}
