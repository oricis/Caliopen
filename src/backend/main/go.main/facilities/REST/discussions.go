// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package REST

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

func (rest *RESTfacility) GetDiscussionsList(user *UserInfo, ILrange, PIrange [2]int8, limit, offset int) ([]Discussion, int64, error) {
	discussions := []Discussion{}
	var total int64
	var err error

	return discussions, total, err
}
