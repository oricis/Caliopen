package users

import (
	"github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"testing"
)

func TestChangeUserPassword(t *testing.T) {
	user := objects.User{
		Password: "$2b$12$pPAhvbQUnRyEC/eX/C8Y9O/N75ZN8Hxe1zD1mlle9Ru0Ngwa6LNgS",
	}

	e := ChangeUserPassword(&user)

	t.Log(e)
}
