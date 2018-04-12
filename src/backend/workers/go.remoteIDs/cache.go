/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package go_remoteIDs

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type cacheEntry struct {
	iDkey        string
	pollInterval uint16
	remoteID     RemoteIdentity
}

func (p *Poller) updateCache() (added, removed, updated map[string]bool, err error) {
	added = make(map[string]bool)
	removed = make(map[string]bool)
	updated = make(map[string]bool)
	fetched := make(map[string]bool)
	remotes, err := p.Store.RetrieveAllRemotes()
	if err != nil {
		//TODO
	}

	for remote := range remotes {
		idkey := remote.UserId.String() + remote.Identifier
		fetched[idkey] = true
		if entry, ok := p.Cache[idkey]; ok {
			//TODO : check if pollinterval has changed
			entry.pollInterval = entry.pollInterval
		} else {
			p.Cache[idkey] = cacheEntry{
				iDkey:        idkey,
				pollInterval: 15, //TODO
				remoteID:     *remote,
			}
			added[idkey] = true
		}
	}
	for key, _ := range p.Cache {
		if _, ok := fetched[key]; !ok {
			delete(p.Cache, key)
			removed[key] = true
		}
	}
	return
}
