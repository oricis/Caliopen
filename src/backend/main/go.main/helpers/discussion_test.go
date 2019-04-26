// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"strings"
	"testing"
)

func TestComputeDiscussionIL(t *testing.T) {
	sets := [][]float64{
		{1, 2, 2, 2, 5, -1, 10, 5, 5, 6},
		{-1, -2, 3, 2, 5, -1, 10, 5, 5, 6},
		{1, 2},
		{5},
		{-10},
		{9, -10},
		{-1, -1},
	}
	for i, set := range sets {
		IL := ComputeDiscussionIL(set)
		if IL == 0 {
			t.Errorf("got 0 result for set %d", i)
		}
	}

}

func TestHashFromParticipantsUris(t *testing.T) {
	participants := []Participant{
		{
			Address:  "kaushal.modi@gmail.com",
			Protocol: "email",
			Type:     "From",
		},
		{
			Address:  "dev@caliopen.local",
			Protocol: "email",
			Type:     "To",
		},
		{
			Address:  "eliz@gnu.org",
			Protocol: "email",
			Type:     "Cc",
		},
		{
			Address:  "dev@caliopen.local",
			Protocol: "email",
			Type:     "Cc",
		},
	}
	hash, components, err := HashFromParticipantsUris(participants)
	if err != nil {
		t.Error(err)
	}
	if hash != "f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec" {
		t.Errorf("expected hash f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec, got %s", hash)
	}
	if !strings.EqualFold("email:dev@caliopen.localemail:eliz@gnu.orgemail:kaushal.modi@gmail.com", strings.Join(components, "")) {
		t.Errorf("expected components = email:dev@caliopen.localemail:eliz@gnu.orgemail:kaushal.modi@gmail.com, got %s", strings.Join(components, ""))
	}
	/*


		hash = f639c352610d899ed1d564fe9e133c4a4ab269f45b6e27507144bb1a196d90ec
	*/
}
