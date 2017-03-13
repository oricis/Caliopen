package objects

import (
	"time"
)

type (
	ContactModel struct {
		User_id     CaliopenUUID `cql:"user_id"`
		Contact_id  CaliopenUUID `cql:"contact_id"`
		Date_insert time.Time    `cql:"date_insert"`
		Family_name string       `cql:"family_name"`
		Given_name  string       `cql:"given_name"`
	}
)
