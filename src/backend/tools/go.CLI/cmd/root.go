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
	"github.com/spf13/viper"
	"os"
)

var cfgPath string
var apiCfgFile string
var lmtpCfgFile string

func init() {
	cobra.OnInitialize(initConfig)

	RootCmd.PersistentFlags().StringVar(&cfgPath, "confPath", "", "Path to seek the two mandatory config files: caliopen-go-api_dev.yaml and caliopen-go-lmtp_dev.yaml")
	RootCmd.PersistentFlags().StringVar(&apiCfgFile, "apiConf", "", "Caliopen's API config file (default is ./caliopen-go-api_dev.yaml)")
	RootCmd.PersistentFlags().StringVar(&lmtpCfgFile, "lmtpConf", "", "Caliopen's lmtpd config file (default is ./caliopen-go-lmtp_dev.yaml)")
}

// RootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:   "gocaliopen",
	Short: "Caliopen CLI to interact with stack",
	Long: `gocaliopen needs two of Caliopen's config files : caliopen-go-api_dev.yaml and caliopen-go-lmtp_dev.yaml.
It loads them from --confPath directory unless  path/filenames are specified with the --apiConf and --lmtpConf flags.
gocaliopen subcommands could interact with
	- store (Cassandra)
	- index (Elasticsearch)
	- message queue (NATS)
	- cache (Redis)
	- apiV1
	- apiV2
	- lmtpd`,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// initConfig reads in config files and ENV variables if set.
func initConfig() {
	apiConf := viper.New()
	lmtpConf := viper.New()

	if cfgPath != "" {
		// Use path from the flag
		apiConf.AddConfigPath(cfgPath)
		lmtpConf.AddConfigPath(cfgPath)
	} else {
		// set defaults to relative path from /tools/go.CLI
		apiConf.AddConfigPath("../../configs")
		lmtpConf.AddConfigPath("../../configs")
		// set defaults to current dir
		apiConf.AddConfigPath(".")
		lmtpConf.AddConfigPath(".")
	}

	if apiCfgFile != "" {
		// Use config file name and path from the flag.
		apiConf.SetConfigFile(apiCfgFile)
	} else {
		apiConf.SetConfigName("caliopen-go-api_dev")
	}

	if lmtpCfgFile != "" {
		// Use config file name and path from the flag.
		lmtpConf.SetConfigFile(lmtpCfgFile)
	} else {
		lmtpConf.SetConfigName("caliopen-go-lmtp_dev")
	}

	// read in environment variables that match
	apiConf.AutomaticEnv()
	lmtpConf.AutomaticEnv()

	if err := apiConf.ReadInConfig(); err != nil {
		log.Fatalf("can't load api config file %s", apiCfgFile)
	}
	if err := lmtpConf.ReadInConfig(); err != nil {
		log.Fatalf("can't load lmtp config file %s", lmtpCfgFile)
	}
}
