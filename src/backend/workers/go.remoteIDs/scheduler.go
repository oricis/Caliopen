// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package go_remoteIDs

import (
	"errors"
	log "github.com/Sirupsen/logrus"
	"gopkg.in/robfig/cron.v2"
	"strconv"
)

type Scheduler struct {
	MainCron *cron.Cron
}

func initScheduler() (*Scheduler, error) {
	scheduler := new(Scheduler)
	scheduler.MainCron = cron.New()
	if scheduler.MainCron == nil {
		return nil, errors.New("[initScheduler] failed to create MainCron")
	}

	// add the default dbSync command to cron to periodically re-sync with db
	cronStr := "@every " + strconv.Itoa(int(poller.Config.ScanInterval)) + "m"
	_, err := scheduler.MainCron.AddFunc(cronStr, poller.fullSync)
	if err != nil {
		log.WithError(err)
		return nil, errors.New("[initScheduler] failed to add default fullsync job")
	}
	return scheduler, nil
}

func (s *Scheduler) Start() {
	log.Info("[scheduler] starting MainCron")
	s.MainCron.Start()
}

// AddSyncJobFor builds job from cacheEntry and schedules it in MainCron
// returns cacheEntry updated with its cronId
func (s *Scheduler) AddSyncJobFor(entry cacheEntry) (cacheEntry, error) {
	var err error
	cronStr := "@every " + entry.pollInterval + "m"
	job, err := buildSyncJob(entry)
	if err != nil {
		log.WithError(err).Warn("[AddSyncJobFor] failed to build job to MainCron")
		return entry, errors.New("[AddSyncJobFor] failed to build job to MainCron")
	}
	entry.cronId, err = s.MainCron.AddJob(cronStr, job)
	if err != nil {
		log.WithError(err).Warn("[AddSyncJobFor] failed to add job to MainCron")
		return entry, errors.New("[AddSyncJobFor] failed to add job to MainCron")
	}
	return entry, nil
}

// RemoveJobFor removes remote identity's job from being run in the future
func (s *Scheduler) RemoveJobFor(entry cacheEntry) {
	s.MainCron.Remove(entry.cronId)
}

// UpdateJobFor removes remote identity's job and re-schedule it with new pollinterval
func (s *Scheduler) UpdateSyncJobFor(entry cacheEntry) (cacheEntry, error) {
	s.RemoveJobFor(entry)
	return s.AddSyncJobFor(entry)
}

func (s *Scheduler) Stop() {
	s.MainCron.Stop()
}
