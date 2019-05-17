// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import "github.com/gocql/gocql"

type APIStore struct {
	AttachmentStore
	CredentialStore
	ContactsBackend
	DevicesStore
	DiscussionsStore
	IdentitiesBackend
	KeysStore
	MessagesBackend
	ParticipantStore
	TagsStore
	UserNamesStore
	UsersBackend
}

func (s *APIStore) GetSession() *gocql.Session {
	return nil
}
