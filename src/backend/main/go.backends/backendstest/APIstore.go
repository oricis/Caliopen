// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

type APIStore struct {
	AttachmentStore
	CredentialStore
	ContactsBackend
	DevicesStore
	DiscussionsStore
	IdentitiesBackend
	KeysStore
	MessagesBackend
	TagsStore
	UserNamesStore
	UsersBackend
}
