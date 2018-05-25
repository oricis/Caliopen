/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// fixMissingParticipantsCmd represents the fixMissingParticipants command
var fixMissingParticipantsCmd = &cobra.Command{
	Use:   "fixMissingParticipants",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("fixMissingParticipants called")
	},
}

func init() {
	RootCmd.AddCommand(fixMissingParticipantsCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// fixMissingParticipantsCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// fixMissingParticipantsCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
