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
	"github.com/satori/go.uuid"
	"testing"
)

func TestSendFetchNatsOrder(t *testing.T) {
	nc, err := nats.Connect("nats://nats.dev.caliopen.org:4222")
	defer nc.Close()

	if err != nil {
		t.Fatal(err)
	}
	order := IMAPfetchOrder{
		Order:          "test",
		UserId:         UUID(uuid.NewV4()),
		RemoteIdentity: "test@test",
	}

	o, _ := json.Marshal(order)

	msg := &nats.Msg{Subject: "IMAPfetcher", Data: o}
	err = nc.PublishMsg(msg)
	if err != nil {
		t.Error(err)
	}
	msg = &nats.Msg{Subject: "IMAPfetcher", Data: []byte("hello stan")}
	err = nc.PublishMsg(msg)
	if err != nil {
		t.Error(err)
	}

}
