package backends

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type UrisStorage interface {
	LookupHash(user_id UUID, uri string) ([]HashLookup, error)
	CreateHashLookup(lookup HashLookup) error
}
