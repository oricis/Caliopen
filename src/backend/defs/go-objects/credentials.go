/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package objects

type Credentials map[string]string

func (cred *Credentials) UnmarshalMap(input map[string]interface{}) {
	for k, v := range input {
		(*cred)[k] = v.(string)
	}
}

func (cred *Credentials) UnmarshalCQLMap(input map[string]string) {
	for k, v := range input {
		(*cred)[k] = v
	}
}
