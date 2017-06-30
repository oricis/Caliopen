package objects

import (
	"time"
)

type (
	Contact struct {
		AdditionalName  string            `cql:"additional_name"    json:"additional_name"`
		Addresses       []PostalAddress   `cql:"addresses"          json:"addresses"`
		Avatar          string            `cql:"avatar"             json:"avatar"`
		ContactId       UUID              `cql:"contact_id"         json:"contact_id"`
		DateInsert      time.Time         `cql:"date_insert"        json:"date_insert"`
		DateUpdate      time.Time         `cql:"date_update"        json:"date_update"`
		Deleted         bool              `cql:"deleted"            json:"deleted"`
		Emails          []EmailContact    `cql:"emails"             json:"emails"`
		FamilyName      string            `cql:"family_name"        json:"family_name"`
		GivenName       string            `cql:"given_name"         json:"given_name"`
		Groups          []string          `cql:"groups"             json:"groups"`
		Identities      []SocialIdentity  `cql:"identities"         json:"identities"`
		Ims             []IM              `cql:"ims"                json:"ims"`
		Infos           map[string]string `cql:"infos"              json:"infos"`
		NamePrefix      string            `cql:"name_prefix"        json:"name_prefix"`
		NameSuffix      string            `cql:"name_suffix"        json:"name_suffix"`
		Organizations   []Organization    `cql:"organizations"      json:"organizations"`
		Phones          []Phone           `cql:"phones"             json:"phones"`
		PrivacyIndex    PrivacyIndex      `cql:"pi"                 json:"pi"`
		PrivacyFeatures PrivacyFeatures   `cql:"privacy_features"   json:"privacy_features"`
		Tags            []Tag             `cql:"tags"               json:"tags"`
		Title           string            `cql:"title"              json:"title"`
		UserId          UUID              `cql:"user_id"            json:"user_id"`
	}
)
