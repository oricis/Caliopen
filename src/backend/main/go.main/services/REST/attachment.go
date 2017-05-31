// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import "github.com/pkg/errors"

func (rest *RESTfacility) AddAttachment(user_id, message_id string, attachment []byte) (attachmentURL string, err error) {

	return "", errors.New("not implemented")
}

func (rest *RESTfacility) DeleteAttachment(user_id, message_id string, attchmtIndex int) error {

	return errors.New("not implemented")
}