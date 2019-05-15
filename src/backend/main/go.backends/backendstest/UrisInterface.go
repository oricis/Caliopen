package backendstest

import (
	"errors"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type ParticipantStore struct {
}

func (ps *ParticipantStore) LookupHash(user_id UUID, uri string) ([]HashLookup, error) {
	return nil, errors.New("test interface not implemented")
}

func (ps *ParticipantStore) CreateHashLookup(lookup HashLookup) error {
	return errors.New("test interface not implemented")
}
