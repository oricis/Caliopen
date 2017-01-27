// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backends

import (
	"github.com/CaliOpen/CaliOpen/src/backend/defs/go-objects"
)

type (
	/**** Users ****/
	UserStorage interface {
		Get(*objects.User) error
	}
	UserNameStorage interface {
		IsAvailable(username string) (bool, error)
	}

	/**** HTTP REST API ****/
	APIStorage interface {
		UserNameStorage
	}

	/**** LDA ****/
	LDABackend interface {
		GetRecipients([]string) ([]string, error)
		StoreRaw(data string) (raw_id string, err error)
	}
)
