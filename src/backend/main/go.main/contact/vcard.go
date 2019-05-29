// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package contact

import (
	"errors"
	"github.com/emersion/go-vcard"
	"io"
)

// Parse .vcf .vcard file, returting list of Card objects
func ParseVcardFile(file io.Reader) ([]vcard.Card, error) {
	cards := make([]vcard.Card, 0, 5)

	dec := vcard.NewDecoder(file)

	for {
		card, err := dec.Decode()
		if err == io.EOF {
			break
		} else if err != nil {
			return []vcard.Card{}, err
		}
		cards = append(cards, card)
	}
	if len(cards) == 0 {
		return cards, errors.New("No vcard found in file")
	}
	return cards, nil
}
