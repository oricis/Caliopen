/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	imapWorker "github.com/CaliOpen/Caliopen/src/backend/protocols/go.imap"
	log "github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	cmdConfig  CmdConfig
	configFile string
	configPath string
	verbose    bool
	version    bool
	RootCmd    = &cobra.Command{
		Use:   "imapctl",
		Short: "cli for IMAP operations",
		Long:  "IMAPctl is a cli to control IMAP related operations.",
		Run:   nil,
	}
)

const __version__ = "0.1.0"

type CmdConfig imapWorker.WorkerConfig

func init() {
	cobra.OnInitialize(initConfig)
	RootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false,
		"print out more debug information")
	RootCmd.PersistentFlags().BoolVarP(&version, "version", "V", false,
		"print out the version of this program")
	RootCmd.PersistentFlags().StringVarP(&configFile, "config", "c",
		"caliopen-imap-worker_dev", "Name of the configuration file, without extension. (YAML, TOML, JSON… allowed)")
	RootCmd.PersistentFlags().StringVarP(&configPath, "configpath", "",
		"../../../../configs/", "Main config file path.")
	RootCmd.Run = func(cmd *cobra.Command, args []string) {
		if version {
			log.Infof("IMAPctl version %s", __version__)
		}
		if len(args) == 0 {
			cmd.Help()
		}
	}
	RootCmd.PersistentPreRun = func(cmd *cobra.Command, args []string) {
		if verbose {
			log.SetLevel(log.DebugLevel)
		} else {
			log.SetLevel(log.InfoLevel)
		}
	}
	RootCmd.AddCommand(versionCmd)

}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of IMAPctl",
	Long:  `All software has versions. This is IMAPctl's`,
	Run: func(cmd *cobra.Command, args []string) {
		log.Infof("IMAPctl version %s", __version__)
	},
}

func initConfig() {
	// load in the main config. Reading from YAML, TOML, JSON, HCL and Java properties config files
	v := viper.New()
	v.SetConfigName(configFile)                           // name of config file (without extension)
	v.AddConfigPath(configPath)                           // path to look for the config file in
	v.AddConfigPath("$CALIOPENROOT/src/backend/configs/") // call multiple times to add many search paths
	v.AddConfigPath(".")                                  // optionally look for config in the working directory

	err := v.ReadInConfig() // Find and read the config file*/
	if err != nil {
		log.WithError(err).Fatalf("Could not read main config file <%s>.", configFile)
	}
	err = v.Unmarshal(&cmdConfig)
	if err != nil {
		log.WithError(err).Fatalf("Could not parse config file: <%s>", configFile)
	}

	cmdConfig.LDAConfig.AppVersion = __version__
}
