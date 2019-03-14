// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

// Package backendstest provides utilities and interfaces for mocking backends interfaces
package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

// IdentitiesStorage and IdentityStorageUpdater implementation
type IdentitiesBackend struct {
	localIdentities  map[string]*UserIdentity
	remoteIdentities map[string]*UserIdentity
}

// GetIdentitiesBackend returns an IdentitiesBackend implementing all IdentitiesStorage interfaces
// serving default testdata unless some data are provided in params arrays
func GetIdentitiesBackend(locals, remotes []*UserIdentity) *IdentitiesBackend {
	i := IdentitiesBackend{}
	if len(locals) > 0 {
		for _, local := range locals {
			i.localIdentities[local.UserId.String()+local.Id.String()] = local
		}
	} else {
		i.localIdentities = LocalIdentities
	}
	if len(remotes) > 0 {
		for _, remote := range remotes {
			i.remoteIdentities[remote.UserId.String()+remote.Id.String()] = remote
		}
	} else {
		i.remoteIdentities = RemoteIdentities
	}

	return &i
}

func (ib *IdentitiesBackend) RetrieveLocalsIdentities(user_id string) ([]UserIdentity, error) {
	return RetrieveLocalsIdentities(user_id)
}
func (ib *IdentitiesBackend) CreateUserIdentity(userIdentity *UserIdentity) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ib *IdentitiesBackend) RetrieveUserIdentity(userId, identityId string, withCredentials bool) (*UserIdentity, error) {
	return RetrieveUserIdentity(userId, identityId, withCredentials)
}
func (ib *IdentitiesBackend) LookupIdentityByIdentifier(string, ...string) ([][2]string, error) {
	return [][2]string{}, errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) LookupIdentityByType(string, ...string) ([][2]string, error) {
	return [][2]string{}, errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) UpdateUserIdentity(userIdentity *UserIdentity, fields map[string]interface{}) error {
	return errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) DeleteUserIdentity(userIdentity *UserIdentity) error {
	return errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) RetrieveRemoteIdentities(userId string, withCredentials bool) ([]*UserIdentity, error) {
	return nil, errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) RetrieveAllRemotes(withCredentials bool) (<-chan *UserIdentity, error) {
	return RetrieveAllRemotes(withCredentials)
}
func (ib *IdentitiesBackend) UpdateRemoteInfosMap(userId, remoteId string, infos map[string]string) error {
	return errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) RetrieveRemoteInfosMap(userId, remoteId string) (infos map[string]string, err error) {
	return map[string]string{}, errors.New("test interface not implemented")
}
func (ib *IdentitiesBackend) IsLocalIdentity(userId, identityId string) bool {
	return false
}
func (ib *IdentitiesBackend) IsRemoteIdentity(userId, identityId string) bool {
	return false
}
func (ib *IdentitiesBackend) Close() {

}

func LocalsCount() int {
	return len(LocalIdentities)
}

func RemotesCount() int {
	return len(RemoteIdentities)
}

func ActiveRemotesCount() int {
	var c int
	for _, remote := range RemoteIdentities {
		if remote.Status == "active" {
			c += 1
		}
	}
	return c
}

func RetrieveLocalsIdentities(user_id string) ([]UserIdentity, error) {
	locals := []UserIdentity{}
	for _, local := range LocalIdentities {
		locals = append(locals, *local)
	}
	return locals, nil
}

func RetrieveUserIdentity(userId, identityId string, withCredentials bool) (*UserIdentity, error) {
	if userId == "" && identityId == "" {
		// return one remote identity by default
		for _, remote := range RemoteIdentities {
			if !withCredentials {
				remote.Credentials = nil
			}
			return remote, nil
		}
	}
	if remote, ok := RemoteIdentities[userId+identityId]; ok {
		if !withCredentials {
			remote.Credentials = nil
		}
		return remote, nil
	}
	if local, ok := LocalIdentities[userId+identityId]; ok {
		if !withCredentials {
			local.Credentials = nil
		}
		return local, nil
	}
	return nil, errors.New("not found")
}

func RetrieveAllRemotes(withCredentials bool) (<-chan *UserIdentity, error) {
	ch := make(chan *UserIdentity)
	go func() {
		for _, remote := range RemoteIdentities {
			ch <- remote
		}
		close(ch)
	}()
	return ch, nil
}
