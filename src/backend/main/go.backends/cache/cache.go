// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package cache

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
)

type Cache struct {
	// il faut passer ça partout et juste set le backend en un redis backend
	// comme ça je pourrai créé un cachebackend avec un autre underlying backend
	CacheConfig
	Backend backends.CacheBackend
}
