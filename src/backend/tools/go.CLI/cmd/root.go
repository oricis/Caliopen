/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"fmt"
	"github.com/CaliOpen/Caliopen/src/backend/interfaces/REST/go.server"
	"github.com/CaliOpen/Caliopen/src/backend/protocols/go.smtp"
	log "github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"os"
)

type CmdConfig struct {
	rest_api.APIConfig
	rest_api.IndexConfig
	rest_api.ProxyConfig
}

var (
	cfgPath     string
	apiCfgFile  string
	lmtpCfgFile string
	apiConf     CmdConfig
	lmtpConf    caliopen_smtp.SMTPConfig

	// RootCmd represents the base command when called without any subcommands
	RootCmd = &cobra.Command{
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
)

func init() {
	cobra.OnInitialize(initConfig)

	RootCmd.PersistentFlags().StringVar(&cfgPath, "confPath", "", "Path to seek the two mandatory config files: caliopen-go-api_dev.yaml and caliopen-go-lmtp_dev.yaml")
	RootCmd.PersistentFlags().StringVar(&apiCfgFile, "apiConf", "", "Caliopen's API config file (default is ./caliopen-go-api_dev.yaml)")
	RootCmd.PersistentFlags().StringVar(&lmtpCfgFile, "lmtpConf", "", "Caliopen's lmtpd config file (default is ./caliopen-go-lmtp_dev.yaml)")
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
	apiCfg := viper.New()
	lmtpCfg := viper.New()

	if cfgPath != "" {
		// Use path from the flag
		apiCfg.AddConfigPath(cfgPath)
		lmtpCfg.AddConfigPath(cfgPath)
	} else {
		// set defaults to relative path from /tools/go.CLI
		apiCfg.AddConfigPath("../../configs")
		lmtpCfg.AddConfigPath("../../configs")
		// set defaults to current dir
		apiCfg.AddConfigPath(".")
		lmtpCfg.AddConfigPath(".")
	}

	if apiCfgFile != "" {
		// Use config file name and path from the flag.
		apiCfg.SetConfigFile(apiCfgFile)
	} else {
		apiCfg.SetConfigName("caliopen-go-api_dev")
	}

	if lmtpCfgFile != "" {
		// Use config file name and path from the flag.
		lmtpCfg.SetConfigFile(lmtpCfgFile)
	} else {
		lmtpCfg.SetConfigName("caliopen-go-lmtp_dev")
	}

	// read in environment variables that match
	apiCfg.AutomaticEnv()
	lmtpCfg.AutomaticEnv()

	if err := apiCfg.ReadInConfig(); err != nil {
		log.WithError(err).Fatalf("can't load api config file %s", apiCfgFile)
	}
	if err := apiCfg.Unmarshal(&apiConf); err != nil {
		log.WithError(err).Fatalf("can't parse api config file %s", apiCfgFile)
	}

	if err := lmtpCfg.ReadInConfig(); err != nil {
		log.WithError(err).Fatalf("can't load lmtp config file %s", lmtpCfgFile)
	}
	if err := lmtpCfg.Unmarshal(&lmtpConf); err != nil {
		log.WithError(err).Fatalf("can't parse lmtp config file %s", lmtpCfgFile)
	}

}
