/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package go_remoteIDs

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/Sirupsen/logrus"
	"gopkg.in/robfig/cron.v2"
	"strconv"
)

type cacheEntry struct {
	iDkey        string
	cronId       cron.EntryID
	pollInterval uint16
	remoteID     RemoteIdentity
}

func (p *Poller) updateCache() (added, removed, updated map[string]bool, err error) {
	added = make(map[string]bool)
	removed = make(map[string]bool)
	updated = make(map[string]bool)
	active := make(map[string]bool)
	const defaultInterval = 15
	remotes, err := p.Store.RetrieveAllRemotes()
	if err != nil {
		logrus.WithError(err).Warn("[updateCache] failed to retrieve remote identities")
		return
	}

	for remote := range remotes {
		if remote.Status == "active" {
			//TODO: filter identities by p.Config.RemoteTypes
			idkey := remote.UserId.String() + remote.Identifier
			active[idkey] = true
			if entry, ok := p.Cache[idkey]; ok {
				//check if pollinterval has changed
				pollInterval, err := strconv.Atoi(remote.Infos["pollinterval"])
				if err != nil {
					// do not resign, take a default value instead
					pollInterval = defaultInterval
				}
				if entry.pollInterval != uint16(pollInterval) {
					entry.pollInterval = uint16(pollInterval)
					updated[idkey] = true
				}
			} else {
				pollInterval, err := strconv.Atoi(remote.Infos["pollinterval"])
				if err != nil {
					// do not resign, take a default value instead
					pollInterval = defaultInterval
				}
				p.Cache[idkey] = cacheEntry{
					iDkey:        idkey,
					pollInterval: uint16(pollInterval),
					remoteID:     *remote,
				}
				added[idkey] = true
			}
		}
	}
	for key, _ := range p.Cache {
		if _, ok := active[key]; !ok {
			removed[key] = true
		}
	}
	return
}
