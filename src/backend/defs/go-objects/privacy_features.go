// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

type PrivacyFeatures map[string]string

func (pf *PrivacyFeatures) UnmarshalMap(input map[string]interface{}) {
	for k, v := range input {
		(*pf)[k] = v.(string)
	}
}
