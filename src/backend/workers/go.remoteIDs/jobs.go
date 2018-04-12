/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package go_remoteIDs

import (
	log "github.com/Sirupsen/logrus"
)

const defaultInterval = "15"

// AddJobFor parses remote identity data to build appropriate job and adds it to MainCron
func (p *Poller) AddJobFor(idkey string) (err error) {
	if entry, ok := p.Cache[idkey]; ok {
		switch entry.remoteID.Type {
		case "imap":
			var pollInterval string
			var ok bool
			if pollInterval, ok = entry.remoteID.Infos["pollinterval"]; !ok || pollInterval == "" {
				pollInterval = defaultInterval
			}
			cronStr := "@every " + pollInterval + "m"
			entry.cronId, err = p.MainCron.AddJob(cronStr, imapJob{
				remoteId:  &entry.remoteID,
				poller:    p,
				natsTopic: p.Config.NatsTopics["imap"],
			})
			if err != nil {
				log.WithError(err).Warn("[AddJobFor] failed to add job to MainCron")
			}
		default:
			log.WithError(err).Warnf("[AddJobFor] unknow Remote Identity type <%s>", entry.remoteID.Type)
			return
		}
		return
	} else {
		log.WithError(err).Warnf("[AddJobFor] failed to retrieve cache key <%s>", idkey)
		return
	}
}

func (p *Poller) RemoveJobFor(idkey string) (err error) {
	if entry, ok := p.Cache[idkey]; ok {
		log.Info(entry)
		return
	} else {
		log.WithError(err).Warnf("[RemoveJobFor] failed to retrieve cache key <%s>", idkey)
		return
	}
	return
}

func (p *Poller) UpdateJobFor(idkey string) (err error) {
	if entry, ok := p.Cache[idkey]; ok {
		log.Info(entry)
		return
	} else {
		log.WithError(err).Warnf("[UpdateJobFor] failed to retrieve cache key <%s>", idkey)
		return
	}
	return
}
