/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"fmt"
	imapWorker "github.com/CaliOpen/Caliopen/src/backend/protocols/go.imap"
	log "github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

var (
	configPath    string
	configFile    string
	pidFile       string
	signalChannel chan os.Signal // for trapping SIG_HUP
	cmdConfig     CmdConfig
	imapWorkers   []*imapWorker.Worker

	startCmd = &cobra.Command{
		Use:   "start",
		Short: "Starts IMAP worker(s)",
		Run:   start,
	}
)

const (
	shutdownTimeout = 3 // minutes to wait before forcing shutdown
)

func init() {
	startCmd.PersistentFlags().StringVarP(&configFile, "config", "c",
		"imapworker", "Name of the configuration file, without extension. (YAML, TOML, JSON… allowed)")
	startCmd.PersistentFlags().StringVarP(&configPath, "configpath", "",
		"../../../../configs/", "Main config file path.")
	startCmd.PersistentFlags().StringVarP(&pidFile, "pid-file", "p",
		"/var/run/caliopen_imap_worker.pid", "Path to the pid file")

	RootCmd.AddCommand(startCmd)
	signalChannel = make(chan os.Signal, 1)
	cmdConfig = CmdConfig{}
}

func sigHandler(workers []*imapWorker.Worker) {
	// handle SIGHUP for reloading the configuration while running
	signal.Notify(signalChannel, syscall.SIGHUP, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGINT, syscall.SIGKILL)

	for sig := range signalChannel {

		if sig == syscall.SIGHUP {
			err := readConfig(&cmdConfig)
			if err != nil {
				log.WithError(err).Error("Error while ReadConfig (reload)")
			} else {
				log.Info("Configuration is reloaded")
			}
			// TODO: reinitialize
		} else if sig == syscall.SIGTERM || sig == syscall.SIGQUIT || sig == syscall.SIGINT || sig == syscall.SIGKILL {
			log.Infof("Shutdown signal caught. Gracefully halting %d workers within 3 minutes timeframe…", len(workers))
			wg := new(sync.WaitGroup)
			wg.Add(len(workers))
			for i := range workers {
				workers[i].HaltGroup = wg
			}
			// timeout mechanism to avoid infinite wait
			c := make(chan struct{})
			go func() {
				defer close(c)
				wg.Wait()
			}()
			select {
			case <-c:
				log.Info("Shutdown completed, exiting")
				os.Exit(0)
			case <-time.After(shutdownTimeout * time.Minute):
				log.Warn("Shutdown timeout, force exiting")
				os.Exit(0)
			}
		} else {
			os.Exit(0)
		}
	}
}

func start(cmd *cobra.Command, args []string) {

	err := readConfig(&cmdConfig)
	if err != nil {
		log.WithError(err).Fatal("Error while reading config")
	}
	// Write out our PID
	if len(pidFile) > 0 {
		if f, err := os.Create(pidFile); err == nil {
			defer f.Close()
			if _, err := f.WriteString(fmt.Sprintf("%d", os.Getpid())); err == nil {
				f.Sync()
			} else {
				log.WithError(err).Warnf("Error while writing pidFile (%s)", pidFile)
			}
		} else {
			log.WithError(err).Warnf("Error while creating pidFile (%s)", pidFile)
		}
	}

	// init and start worker(s)
	var i uint8
	imapWorkers = make([]*imapWorker.Worker, cmdConfig.Workers)
	for i = 0; i < cmdConfig.Workers; i++ {
		log.Infof("initializing IMAP worker %d", i)
		imapWorkers[i], err = imapWorker.NewWorker(imapWorker.WorkerConfig(cmdConfig), i)
		if err != nil {
			log.WithError(err).Fatal("Failed to init IMAP Worker")
		}
		go imapWorkers[i].Start()
	}
	sigHandler(imapWorkers)
}

type CmdConfig imapWorker.WorkerConfig

// ReadConfig which should be called at startup, or when a SIG_HUP is caught
func readConfig(config *CmdConfig) error {
	// load in the main config. Reading from YAML, TOML, JSON, HCL and Java properties config files
	v := viper.New()
	v.SetConfigName(configFile)                           // name of config file (without extension)
	v.AddConfigPath(configPath)                           // path to look for the config file in
	v.AddConfigPath("$CALIOPENROOT/src/backend/configs/") // call multiple times to add many search paths
	v.AddConfigPath(".")                                  // optionally look for config in the working directory

	err := v.ReadInConfig() // Find and read the config file*/
	if err != nil {
		log.WithError(err).Infof("Could not read main config file <%s>.", configFile)
		return err
	}
	err = v.Unmarshal(config)
	if err != nil {
		log.WithError(err).Infof("Could not parse config file: <%s>", configFile)
		return err
	}

	config.LDAConfig.AppVersion = __version__
	return nil
}
