/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 *
 * // const, GetTime & ToUnixTime borrowed from github.com/google/uuid
 */
package helpers

import (
	"encoding/binary"
	"github.com/satori/go.uuid"
	"time"
)

const (
	lillian    = 2299160          // Julian day of 15 Oct 1582
	unix       = 2440587          // Julian day of 1 Jan 1970
	epoch      = unix - lillian   // Days between epochs
	g1582      = epoch * 86400    // seconds between epochs
	g1582ns100 = g1582 * 10000000 // 100s of a nanoseconds between epochs
)

// GetTime returns the time in 100s of nanoseconds since 15 Oct 1582 encoded in
// uuid.  The time is only defined for version 1 and 2 UUIDs.
func GetTime(uuid uuid.UUID) time.Time {
	t := int64(binary.BigEndian.Uint32(uuid[0:4]))
	t |= int64(binary.BigEndian.Uint16(uuid[4:6])) << 32
	t |= int64(binary.BigEndian.Uint16(uuid[6:8])&0xfff) << 48
	return time.Unix(toUnixTime(t))
}

// ToUnixTime converts t the number of seconds and nanoseconds using the Unix
// epoch of 1 Jan 1970.
func toUnixTime(t int64) (sec, nsec int64) {
	sec = int64(t - g1582ns100)
	nsec = (sec % 10000000) * 100
	sec /= 10000000
	return sec, nsec
}
