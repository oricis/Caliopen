/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

type DiscoverKeyMessage struct {
	Order      string           `json:"order"`
	ContactId  string           `json:"contact_id"`
	UserId     string           `json:"user_id"`
	Emails     []EmailContact   `json:"emails,omitempty"`
	Identities []SocialIdentity `json:"identities,omitempty"`
}
