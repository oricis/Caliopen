// Copyleft (ɔ) 2019 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package contact

import (
	"bufio"
	"bytes"
	"github.com/emersion/go-vcard"
	"io"
	"strings"
)

func parseBuffer(buffer io.Reader) (vcard.Card, error) {
	dec := vcard.NewDecoder(buffer)
	for {
		card, err := dec.Decode()
		if err != nil {
			return vcard.Card{}, err
		}
		return card, nil
	}
}

// Parse .vcf .vcard file, returting list of Card objects
func ParseVcardFile(file io.Reader) ([]vcard.Card, error) {
	cards := make([]vcard.Card, 0, 5)

	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)

	current := make([]string, 0, 1)

	for scanner.Scan() {
		line := scanner.Text()
		current = append(current, line)
		if line == "END:VCARD" {
			text := strings.Join(current, "\n")
			card, err := parseBuffer(bytes.NewBufferString(text))
			if err != nil {
				return cards, err
			}
			cards = append(cards, card)
			current = make([]string, 0, 1)
		}
	}
	return cards, nil
}
