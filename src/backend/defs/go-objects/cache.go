// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import "time"

// struct to store temporary token sessions for users into cache
type TokenSession struct {
	ExpiresAt  time.Time `json:"expires_at"`
	ExpiresIn  int       `json:"expires_in"`
	ResourceId string    `json:"resource_id"`
	Token      string    `json:"token"`
	UserId     string    `json:"user_id"`
}
