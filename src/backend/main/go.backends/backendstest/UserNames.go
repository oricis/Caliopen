// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type UserNamesStore struct{}

func (uns UserNamesStore) UsernameIsAvailable(username string) (bool, error) {
	return false, errors.New("test interface not implemented")
}
func (uns UserNamesStore) UserByUsername(username string) (user *User, err error) {
	return UserByUsername(username)
}

func UserByUsername(username string) (user *User, err error) {
	for _, user := range Users {
		if user.Name == username {
			return user, nil
		}
	}
	return nil, errors.New("not found")
}
