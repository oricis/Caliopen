/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/Sirupsen/logrus"
	"github.com/gocassa/gocassa"
	"github.com/gocql/gocql"
	"gopkg.in/oleiade/reflections.v1"
	"time"
)

func (cb *CassandraBackend) RetrieveLocalsIdentities(userId string) (identities []UserIdentity, err error) {
	var count int
	iter := cb.Session.Query(`SELECT identity_id FROM identity_type_lookup WHERE type = ? AND user_id = ?`, LocalIdentity, userId).Iter()
	for {
		var identityID gocql.UUID
		if !iter.Scan(&identityID) {
			break
		}
		count++
		i := make(map[string]interface{})
		cb.Session.Query(`SELECT * FROM user_identity WHERE user_id = ? AND identity_id = ?`, userId, identityID).MapScan(i)
		identity := new(UserIdentity)
		identity.UnmarshalCQLMap(i)
		identities = append(identities, *identity)
	}
	if count == 0 {
		err = errors.New("not found")
		return
	}
	return
}

func (cb *CassandraBackend) CreateUserIdentity(userIdentity *UserIdentity) CaliopenError {

	ridT := cb.IKeyspace.Table("remote_identity", &UserIdentity{}, gocassa.Keys{
		PartitionKeys: []string{"user_id", "remote_id"},
	}).WithOptions(gocassa.Options{TableName: "remote_identity"})

	// check if remote already exist
	var count int
	err := cb.Session.Query(`SELECT count(*) from remote_identity WHERE user_id = ? AND remote_id = ?`, userIdentity.UserId, userIdentity.Id).Scan(&count)
	if err != nil {
		return WrapCaliopenErr(err, DbCaliopenErr, "[CassandraBackend] CreateUserIdentity fails")
	}
	if count != 0 {
		return NewCaliopenErrf(ForbiddenCaliopenErr, "[CassandraBackend] CreateUserIdentity error : remote identity <%s> already exist for user <%s>", userIdentity.Id, userIdentity.UserId.String())
	}

	// remove credentials from struct
	cred := userIdentity.Credentials
	(*userIdentity).Credentials = nil

	// create remote identity
	err = ridT.Set(userIdentity).Run()
	if err != nil {
		return WrapCaliopenErrf(err, DbCaliopenErr, "[CassandraBackend] CreateUserIdentity fails : %s", err.Error())
	}

	// create credentials apart
	err = cb.CreateCredentials(userIdentity, *cred)
	if err != nil {
		return WrapCaliopenErr(err, DbCaliopenErr, "[CassandraBackend) CreateUserIdentity failed to createCredentials")
	}

	return nil
}

func (cb *CassandraBackend) RetrieveUserIdentity(userId, remoteId string, withCredentials bool) (userIdentity *UserIdentity, err error) {

	userIdentity = new(UserIdentity)
	m := map[string]interface{}{}
	q := cb.Session.Query(`SELECT * FROM remote_identity WHERE user_id = ? AND remote_id = ?`, userId, remoteId)
	err = q.MapScan(m)
	if err != nil {
		return nil, err
	}
	userIdentity.UnmarshalCQLMap(m)
	if withCredentials {
		cred, err := cb.RetrieveCredentials(userId, remoteId)
		if err != nil {
			return nil, err
		}
		userIdentity.Credentials = &cred
	} else {
		// discard credentials
		userIdentity.Credentials = nil
	}

	return
}

func (cb *CassandraBackend) UpdateUserIdentity(userIdentity *UserIdentity, fields map[string]interface{}) (err error) {
	//remove Credentials from userIdentity and process this special property apart
	if cred, ok := fields["Credentials"].(Credentials); ok {
		(*userIdentity).Credentials = nil
		delete(fields, "Credentials")
		err = cb.UpdateCredentials(userIdentity.UserId.String(), userIdentity.Id.String(), cred)
		if err != nil {
			logrus.WithError(err).Warn("[CassandraBackend] UpdateUserIdentity failed to update credentials")
		}
	}

	if len(fields) > 0 {
		//get cassandra's field name for each field to modify
		cassaFields := map[string]interface{}{}
		for field, value := range fields {
			cassaField, err := reflections.GetFieldTag(userIdentity, field, "cql")
			if err != nil {
				return fmt.Errorf("[CassandraBackend] UpdateUserIdentity failed to find a cql field for object field %s", field)
			}
			if cassaField != "-" {
				cassaFields[cassaField] = value
			}
		}

		ridT := cb.IKeyspace.Table("remote_identity", &UserIdentity{}, gocassa.Keys{
			PartitionKeys: []string{"user_id", "remote_id"},
		}).WithOptions(gocassa.Options{TableName: "remote_identity"})

		return ridT.Where(gocassa.Eq("user_id", userIdentity.UserId.String()), gocassa.Eq("remote_id", userIdentity.Id.String())).
			Update(cassaFields).Run()
	}

	return err
}

func (cb *CassandraBackend) RetrieveRemoteIdentities(userId string, withCredentials bool) (userIdentities []*UserIdentity, err error) {
	var count int
	iter := cb.Session.Query(`SELECT identity_id FROM identity_type_lookup WHERE type = ? AND user_id = ?`, RemoteIdentity, userId).Iter()
	for {
		var identityID gocql.UUID
		if !iter.Scan(&identityID) {
			break
		}
		count++
		i := make(map[string]interface{})
		cb.Session.Query(`SELECT * FROM user_identity WHERE user_id = ? AND identity_id = ?`, userId, identityID).MapScan(i)
		identity := new(UserIdentity)
		identity.UnmarshalCQLMap(i)
		if withCredentials {
			cred, err := cb.RetrieveCredentials(userId, identity.Id.String())
			if err != nil {
				// return remote identity even if credentials retrieval failed
				cred = Credentials{}
			}
			identity.Credentials = &cred
		} else {
			// discard credentials
			identity.Credentials = nil
		}
		userIdentities = append(userIdentities, identity)
	}
	if count == 0 {
		err = errors.New("not found")
		return
	}
	return
}

// RetrieveAllRemotes returns a chan to range over all remote identities found in db
func (cb *CassandraBackend) RetrieveAllRemotes(withCredentials bool) (<-chan *UserIdentity, error) {

	ch := make(chan *UserIdentity)
	go func(cb *CassandraBackend, ch chan *UserIdentity) {
		iter := cb.Session.Query(`SELECT * from remote_identity`).Iter()

		for {
			//new map each iteration
			remoteID := make(map[string]interface{})
			if !iter.MapScan(remoteID) {
				break
			}
			userIdentity := new(UserIdentity)
			userIdentity.UnmarshalCQLMap(remoteID)
			if withCredentials {
				cred, err := cb.RetrieveCredentials(userIdentity.UserId.String(), userIdentity.Id.String())
				if err != nil {
					userIdentity.Credentials = &cred
				} else {
					userIdentity.Credentials = nil
				}
			} else {
				userIdentity.Credentials = nil
			}

			select {
			case ch <- userIdentity:
			case <-time.After(cb.Timeout):
				logrus.Warn("[RetrieveAllRemote] write timeout on chan")
			}
		}

		iter.Close()
		close(ch)
	}(cb, ch)

	return ch, nil
}

func (cb *CassandraBackend) DeleteUserIdentity(userIdentity *UserIdentity) error {
	if cb.UseVault {
		err := cb.Vault.DeleteCredentials(userIdentity.UserId.String(), userIdentity.Id.String())
		if err != nil {
			logrus.WithError(err).Warn("[CassandraBackend] DeleteUserIdentity failed to delete credentials in vault")
		}
	}
	return cb.Session.Query(`DELETE FROM remote_identity WHERE user_id = ? AND remote_id = ?`, userIdentity.UserId, userIdentity.Id).Exec()
}
