package operations

import (
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
	"strconv"
	"strings"
)

// fall back to default values if can't extract valid numbers.
func GetImportanceLevel(ctx *gin.Context) (il [2]int8) {
	il = [2]int8{-10, 10} // default values
	var from, to int
	var err error
	if il_header, ok := ctx.Request.Header["X-Caliopen-Il"]; !ok {
		return il
	} else {
		il_range_str := strings.Split(il_header[0], ";") // get only first value found
		if len(il_range_str) != 2 {
			return il
		}
		from, err = strconv.Atoi(il_range_str[0])
		if err != nil {
			from = -10
		}
		to, err = strconv.Atoi(il_range_str[1])
		if err != nil {
			to = 10
		}
		if from < -10 || from > 10 {
			from = -10
		}
		if to < -10 || to > 10 {
			to = 10
		}
		if from > to {
			from = to
		}
		il[0] = int8(from)
		il[1] = int8(to)
		return
	}
}

// fall back to default values if can't extract valid numbers.
func GetPrivacyIndex(ctx *gin.Context) (pi [2]int8) {
	pi = [2]int8{0, 100} // default values
	var from, to int
	var err error
	if pi_header, ok := ctx.Request.Header["X-Caliopen-Pi"]; !ok {
		return pi
	} else {
		pi_range_str := strings.Split(pi_header[0], ";") // get only first value found
		if len(pi_range_str) != 2 {
			return pi
		}
		from, err = strconv.Atoi(pi_range_str[0])
		if err != nil {
			from = 0
		}
		to, err = strconv.Atoi(pi_range_str[1])
		if err != nil {
			to = 100
		}
		if from < 0 || from > 100 {
			from = 0
		}
		if to < 0 || to > 100 {
			to = 100
		}
		if from > to {
			from = to
		}
		pi[0] = int8(from)
		pi[1] = int8(to)
		return
	}
}

// NormalizeUUIDstring returns a valid uuidv4 string from input
// or an error if input string is invalid.
// Following input formats are supported:
// "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
// "{6ba7b810-9dad-11d1-80b4-00c04fd430c8}",
// "urn:uuid:6ba7b810-9dad-11d1-80b4-00c04fd430c8"
// Output string is always in "6ba7b810-9dad-11d1-80b4-00c04fd430c8" format.
func NormalizeUUIDstring(uuid_str string) (string, error) {
	id, err := uuid.FromString(uuid_str)
	if err != nil {
		return "", err
	}
	return id.String(), nil
}
