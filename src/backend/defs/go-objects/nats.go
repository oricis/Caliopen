/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

// IMAPfetchOrder is model for message sent on topic 'IMAPfetcher' in NATS's queue 'IMAPworkers'
type IMAPfetchOrder struct {
	Order          string `json:"order"`
	UserId         string `json:"user_id"`
	RemoteIdentity string `json:"remote_identity"`
}
