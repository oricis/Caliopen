package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "caliopen_lmtpd",
	Short: "LMTP daemon",
	Long: `LMTP daemon for the purpose of bridging the public MTA (postfix for ex.) to our local delivery agent.`,
	Run: nil,
}

var (
	verbose bool
)

func init() {
	cobra.OnInitialize()
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false,
		"print out more debug information")
	rootCmd.PersistentPreRun = func(cmd *cobra.Command, args []string) {
		if verbose {
			log.SetLevel(log.DebugLevel)
		} else {
			log.SetLevel(log.InfoLevel)
		}
	}
}
