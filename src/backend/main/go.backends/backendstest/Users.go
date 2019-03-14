// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type UsersBackend struct {
	users map[string]*User
}

func (ub *UsersBackend) GetSettings(userID string) (settings *Settings, err error) {
	return nil, errors.New("GetSettings test interface not implemented")
}
func (ub *UsersBackend) RetrieveUser(userID string) (user *User, err error) {
	if user, ok := Users[userID]; ok {
		return user, nil
	}
	return nil, errors.New("not found")
}
func (ub *UsersBackend) UpdateUserPasswordHash(user *User) error {
	return errors.New("UpdateUserPasswordHash test interface not implemented")
}
func (ub *UsersBackend) UpdateUser(user *User, fields map[string]interface{}) error {
	return errors.New("UpdateUser test interface not implemented")
}
func (ub *UsersBackend) UserByRecoveryEmail(email string) (user *User, err error) {
	return nil, errors.New("UserByRecoveryEmail test interface not implemented")
}
func (ub *UsersBackend) DeleteUser(userID string) error {
	return errors.New("DeleteUser test interface not implemented")
}
func (ub *UsersBackend) GetShardForUser(userID string) string {
	if user, ok := Users[userID]; ok {
		return user.ShardId
	}
	return ""
}
func (ub *UsersBackend) UsernameIsAvailable(username string) (bool, error) {
	return false, errors.New("UsernameIsAvailable test interface not implemented")
}
func (ub *UsersBackend) UserByUsername(username string) (user *User, err error) {
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
