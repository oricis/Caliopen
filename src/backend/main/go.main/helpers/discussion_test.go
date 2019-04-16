// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package helpers

import "testing"

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
