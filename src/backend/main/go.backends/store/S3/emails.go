// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package S3

import (
	"fmt"
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (mb *MinioBackend) PutRawEmail(email_uuid obj.UUID, raw_email string) (uri string, err error) {
	// fake storage
	const uriTemplate = "%s:%s:%s"
	return fmt.Sprintf(uriTemplate, "fake", "uri", email_uuid.String()), nil
}
