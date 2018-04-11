/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"fmt"
	log "github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"
	"os"
	"os/signal"
	"syscall"
)

var (
	pidFile       string
	signalChannel chan os.Signal // for trapping SIG_HUP
	startCmd      = &cobra.Command{
		Use:   "start",
		Short: "Starts remote identities poller daemon",
		Run:   start,
	}
)

func init() {
	startCmd.PersistentFlags().StringVarP(&configFile, "config", "c",
		"caliopen-IDs-poller_dev", "Name of the configuration file, without extension. (YAML, TOML, JSON… allowed)")
	startCmd.PersistentFlags().StringVarP(&configPath, "configpath", "",
		"../../../../configs/", "Main config file path.")
	startCmd.PersistentFlags().StringVarP(&pidFile, "pid-file", "p",
		"/var/run/caliopen_idpoller.pid", "Path to the pid file")

	RootCmd.AddCommand(startCmd)
	signalChannel = make(chan os.Signal, 1)
	cmdConfig = CmdConfig{}
}

func sigHandler() {
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
		} else if sig == syscall.SIGTERM || sig == syscall.SIGQUIT || sig == syscall.SIGINT {
			log.Info("Shutdown signal caught")

			log.Info("Shutdown completed, exiting")
			os.Exit(0)
		} else {
			os.Exit(0)
		}
	}
}

func start(cmd *cobra.Command, args []string) {

	err := readConfig(&cmdConfig)
	log.Infof("%+v", cmdConfig)
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
				log.WithError(err).Fatalf("Error while writing pidFile (%s)", pidFile)
			}
		} else {
			log.WithError(err).Fatalf("Error while creating pidFile (%s)", pidFile)
		}
	}

}
