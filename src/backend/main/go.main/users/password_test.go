package users

import (
	"errors"
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/tidwall/gjson"
	"testing"
)

func TestChangeUserPassword(t *testing.T) {
	fakeStore := new(fakeStorage)
	user := User{
		Name:            "Idoire",
		Password:        []byte(`$2b$12$pPAhvbQUnRyEC/eX/C8Y9O/N75ZN8Hxe1zD1mlle9Ru0Ngwa6LNgS`),
		PrivacyFeatures: &PrivacyFeatures{},
	}
	patch := []byte(`{"current_state":{"password":"123456"},"password":"1234Idoire"}`)
	p := gjson.ParseBytes(patch)
	e := ChangeUserPassword(&user, &p, fakeStore)

	t.Log(e)
}

type fakeStorage struct{}

func (f *fakeStorage) GetSettings(user_id string) (settings *Settings, err error) {
	return nil, nil
}
func (f *fakeStorage) RetrieveUser(user_id string) (user *User, err error) {
	return nil, nil
}
func (f *fakeStorage) UpdateUserPassword(user *User) error {
	return errors.New(fmt.Sprintf("%s", *(*user).PrivacyFeatures))
}
func (f *fakeStorage) UpdateUser(user *User, fields map[string]interface{}) error {
	return nil
}
func (f *fakeStorage) DeleteUser(userId string) error {
	return nil
}
func (f *fakeStorage) UpdateUserPasswordHash(user *User) error {
	return nil
}
func (f *fakeStorage) UserByRecoveryEmail(email string) (user *User, err error) {
	return nil, nil
}
