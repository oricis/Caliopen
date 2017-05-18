// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package S3

import (
	"fmt"
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"strings"
)

func (mb *MinioBackend) PutRawEmail(email_uuid obj.UUID, raw_email string) (uri string, err error) {
	const uriTemplate = "s3://%s/%s"
	email_reader := strings.NewReader(raw_email)
	email_id_str := email_uuid.String()

	mb.Client.PutObject(mb.RawMsgBucket, email_id_str, email_reader, "application/octet-stream")

	return fmt.Sprintf(uriTemplate, mb.RawMsgBucket, email_id_str), nil
}
