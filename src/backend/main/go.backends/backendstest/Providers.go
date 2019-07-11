// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package backendstest

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
)

type ProvidersStore struct{}

func (ps *ProvidersStore) CreateProvider(*Provider) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ps *ProvidersStore) RetrieveProvider(name, instance string) (*Provider, CaliopenError) {
	return nil, NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ps *ProvidersStore) UpdateProvider(*Provider, map[string]interface{}) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
func (ps *ProvidersStore) DeleteProvider(*Provider) CaliopenError {
	return NewCaliopenErr(NotImplementedCaliopenErr, "test interface not implemented")
}
