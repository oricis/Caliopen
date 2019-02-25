// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

import (
	"bytes"
	"crypto/ecdsa"
	"encoding/hex"
	"encoding/json"
	"fmt"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/keybase/go-crypto/openpgp"
	"github.com/keybase/go-crypto/openpgp/armor"
	"github.com/keybase/go-crypto/openpgp/packet"
	"github.com/satori/go.uuid"
	"math/big"
	"regexp"
	"strings"
	"time"
)

type PublicKey struct {
	// PRIMARY KEYS (UserId, ResourceId, KeyId)
	Algorithm    string    `cql:"alg"              json:"alg,omitempty"                                             patch:"system"`
	Curve        string    `cql:"crv"              json:"crv,omitempty"                                             patch:"system"`
	DateInsert   time.Time `cql:"date_insert"      json:"date_insert,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	DateUpdate   time.Time `cql:"date_update"      json:"date_update,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	Emails       []string  `cql:"emails"           json:"emails"                                                    patch:"system"`
	ExpireDate   time.Time `cql:"expire_date"      json:"expire_date,omitempty"         formatter:"RFC3339Milli"    patch:"system"`
	Fingerprint  string    `cql:"fingerprint"      json:"fingerprint,omitempty"                                     patch:"system"`
	Key          string    `cql:"key"              json:"key,omitempty"                                             patch:"system"`
	KeyId        UUID      `cql:"key_id"           json:"key_id"                                                    patch:"system"`
	KeyType      string    `cql:"kty"              json:"kty,omitempty"                                             patch:"system"`
	Label        string    `cql:"label"            json:"label,omitempty"                                           patch:"user"`
	ResourceId   UUID      `cql:"resource_id"      json:"resource_id"                                               patch:"system"`
	ResourceType string    `cql:"resource_type"    json:"resource_type,omitempty"                                   patch:"system"`
	Size         int       `cql:"size"             json:"size"                                                      patch:"system"`
	Use          string    `cql:"\"use\""          json:"use,omitempty"                                             patch:"system"`
	UserId       UUID      `cql:"user_id"          json:"user_id,omitempty"                                         patch:"system"`
	X            big.Int   `cql:"x"                json:"x,omitempty"                                               patch:"system"`
	Y            big.Int   `cql:"y"                json:"y,omitempty"                                               patch:"system"`
}

// model for nats message triggered after contact create/update
type DiscoverKeyMessage struct {
	Order      string           `json:"order"`
	ContactId  string           `json:"contact_id"`
	UserId     string           `json:"user_id"`
	Emails     []EmailContact   `json:"emails,omitempty"`
	Identities []SocialIdentity `json:"identities,omitempty"`
}

// model for nats message triggered after a GPG key has been uploaded and linked to a contact
type PublishKeyMessage struct {
	Order      string `json:"order"`
	UserId     string `json:"user_id"`
	ResourceId string `json:"resource_id"`
	KeyId      string `json:"key_id"`
}

// unmarshal a map[string]interface{} that must owns all PublicKey's fields
// typical usage is for unmarshaling response from Cassandra backend
func (pk *PublicKey) UnmarshalCQLMap(input map[string]interface{}) {
	if alg, ok := input["alg"].(string); ok {
		pk.Algorithm = alg
	}
	if crv, ok := input["crv"].(string); ok {
		pk.Curve = crv
	}
	if dateInsert, ok := input["date_insert"].(time.Time); ok {
		pk.DateInsert = dateInsert
	}
	if dateUpdate, ok := input["date_update"].(time.Time); ok {
		pk.DateUpdate = dateUpdate
	}
	if emails, ok := input["emails"]; ok && emails != nil {
		pk.Emails = []string{}
		for _, email := range emails.([]string) {
			pk.Emails = append(pk.Emails, email)
		}
	}
	if expireDate, ok := input["expire_date"].(time.Time); ok {
		pk.ExpireDate = expireDate
	}
	if fingerprint, ok := input["fingerprint"].(string); ok {
		pk.Fingerprint = fingerprint
	}
	if key, ok := input["key"].(string); ok {
		pk.Key = key
	}
	if keyid, ok := input["key_id"].(gocql.UUID); ok {
		pk.KeyId.UnmarshalBinary(keyid.Bytes())
	}
	if kty, ok := input["kty"].(string); ok {
		pk.KeyType = kty
	}
	if label, ok := input["label"].(string); ok {
		pk.Label = label
	}
	if resourceId, ok := input["resource_id"].(gocql.UUID); ok {
		pk.ResourceId.UnmarshalBinary(resourceId.Bytes())
	}
	if resourceType, ok := input["resource_type"].(string); ok {
		pk.ResourceType = resourceType
	}
	if size, ok := input["size"].(*big.Int); ok {
		pk.Size = int(size.Int64())
	}
	if use, ok := input["use"].(string); ok {
		pk.Use = use
	}
	if userid, ok := input["user_id"].(gocql.UUID); ok {
		pk.UserId.UnmarshalBinary(userid.Bytes())
	}
	if x, ok := input["x"].(*big.Int); ok {
		pk.X = *x
	}
	if y, ok := input["y"].(*big.Int); ok {
		pk.Y = *y
	}
}

func (pk *PublicKey) UnmarshalMap(input map[string]interface{}) error {
	if alg, ok := input["alg"].(string); ok {
		pk.Algorithm = alg
	}
	if crv, ok := input["crv"].(string); ok {
		pk.Curve = crv
	}
	if dateInsert, ok := input["date_insert"]; ok {
		pk.DateInsert, _ = time.Parse(time.RFC3339Nano, dateInsert.(string))
	}
	if dateUpdate, ok := input["date_update"]; ok {
		pk.DateUpdate, _ = time.Parse(time.RFC3339Nano, dateUpdate.(string))
	}
	if emails, ok := input["emails"]; ok && emails != nil {
		pk.Emails = []string{}
		for _, email := range emails.([]string) {
			pk.Emails = append(pk.Emails, email)
		}
	}
	if expireDate, ok := input["expire_date"]; ok {
		pk.ExpireDate, _ = time.Parse(time.RFC3339Nano, expireDate.(string))
	}
	if fingerprint, ok := input["fingerprint"].(string); ok {
		pk.Fingerprint = fingerprint
	}
	if key, ok := input["key"].(string); ok {
		pk.Key = key
	}
	if keyid, ok := input["key_id"].(string); ok {
		if id, err := uuid.FromString(keyid); err == nil {
			pk.KeyId.UnmarshalBinary(id.Bytes())
		}
	}
	if kty, ok := input["kty"].(string); ok {
		pk.KeyType = kty
	}
	if label, ok := input["label"].(string); ok {
		pk.Label = label
	}
	if resourceId, ok := input["resource_id"].(string); ok {
		if id, err := uuid.FromString(resourceId); err == nil {
			pk.ResourceId.UnmarshalBinary(id.Bytes())
		}
	}
	if resourceType, ok := input["resource_type"].(string); ok {
		pk.ResourceType = resourceType
	}
	if size, ok := input["size"].(*big.Int); ok {
		pk.Size = int(size.Int64())
	}
	if use, ok := input["use"].(string); ok {
		pk.Use = use
	}
	if userid, ok := input["user_id"].(string); ok {
		if id, err := uuid.FromString(userid); err == nil {
			pk.UserId.UnmarshalBinary(id.Bytes())
		}
	}
	if x, ok := input["x"].(*big.Int); ok {
		pk.X = *x
	}
	if y, ok := input["y"].(*big.Int); ok {
		pk.Y = *y
	}
	return nil
}

func (pk *PublicKey) UnmarshalJSON(b []byte) error {
	input := map[string]interface{}{}
	if err := json.Unmarshal(b, &input); err != nil {
		return err
	}

	return pk.UnmarshalMap(input)
}

// UnmarshalPGPEntity unmarshal a PGP entity into a PublicKey struct
// ONLY if entity hold an identity matching with one contact's email address
func (pk *PublicKey) UnmarshalPGPEntity(label string, entity *openpgp.Entity, contact *Contact) error {

	if entity.PrimaryKey == nil {
		return fmt.Errorf("no primary found in entity")
	}
	if contact == nil {
		return fmt.Errorf("miss contact")
	}

	if err := entity.PrimaryKey.ErrorIfDeprecated(); err != nil {
		return err
	}

	//list contact's emails
	emails := map[string]struct{}{}
	for _, email := range contact.Emails {
		if email.Address != "" {
			emails[email.Address] = struct{}{}
		}
	}
	if len(emails) == 0 {
		return fmt.Errorf("no email address found in contact %s", contact.ContactId.String())
	}

	/*  TODO : manage multiple identity and/or multiple subkeys */
	if len(entity.Identities) < 1 {
		return fmt.Errorf("no identity packet found in entity")
	}
	var identityFound = false
	var identityName string
	emailsInKey := []string{}
	for name, identity := range entity.Identities {
		if identity.Name != "" {
			emailFound := ExtractEmailAddrFromString(identity.Name)
			emailsInKey = append(emailsInKey, emailFound)
			if _, ok := emails[emailFound]; ok {
				identityFound = true
				identityName = name
				break
			}
		}
	}
	if !identityFound {
		return fmt.Errorf("no matching identity found for contact %s", contact.ContactId.String())
	}

	pk.MarshallNew(contact)

	// embed key in ASCII armor format
	b := new(bytes.Buffer)
	armourBuffer, err := armor.Encode(b, openpgp.PublicKeyType, map[string]string{})
	if err != nil {
		return fmt.Errorf("failed to init ASCII armor : %s", err.Error())
	}
	entity.Serialize(armourBuffer)
	armourBuffer.Close()
	pk.Key = b.String()

	// encode fingerprint to upper hexastring
	pk.Fingerprint = strings.ToUpper(hex.EncodeToString(entity.PrimaryKey.Fingerprint[:]))

	pk.Label = label
	keyLength, _ := entity.PrimaryKey.BitLength()
	pk.Size = int(keyLength)
	if entity.PrimaryKey.CanSign() {
		pk.Use = SIGNATURE_KEY
	}

	// try to complement data from identity & signature packets
	identity := entity.Identities[identityName]
	if identity.SelfSignature == nil {
		log.Warn("no self signature found to unmarshal PGP entity into public key ", pk.KeyId.String())
		return nil
	}

	if identity.SelfSignature.KeyExpired(time.Now()) {
		log.Warn("self signature has expired")
		return nil
	}

	hashSize := identity.SelfSignature.Hash.Size() * 8 // size in in bytes, convert it to bits
	pk.ExpireDate = GetExpiryDate(identity.SelfSignature)
	pk.KeyType = PGP_KEY_TYPE
	switch entity.PrimaryKey.PubKeyAlgo {
	case packet.PubKeyAlgoRSA, packet.PubKeyAlgoRSAEncryptOnly, packet.PubKeyAlgoRSASignOnly:
		switch hashSize {
		case 256:
			pk.Algorithm = RSA256
		case 384:
			pk.Algorithm = RSA384
		case 512:
			pk.Algorithm = RSA512
		default:
			log.Warn("unsupported hash size")
		}
	case packet.PubKeyAlgoECDSA:
		key := entity.PrimaryKey.PublicKey.(*ecdsa.PublicKey)
		pk.Curve = key.Params().Name
		pk.X = *key.X
		pk.Y = *key.Y
		switch hashSize {
		case 256:
			pk.Algorithm = ECDSA256
		case 384:
			pk.Algorithm = ECDSA384
		default:
			log.Warn("unsupported hash size")
		}
	case packet.PubKeyAlgoDSA:
		switch hashSize {
		case 256:
			pk.Algorithm = DSA256
		case 384:
			pk.Algorithm = DSA384
		case 512:
			pk.Algorithm = DSA512
		default:
			log.Warn("unsupported hash size")
		}
	case packet.PubKeyAlgoElGamal:
		switch hashSize {
		case 256:
			pk.Algorithm = ELGAMAL256
		case 384:
			pk.Algorithm = ELGAMAL384
		case 512:
			pk.Algorithm = ELGAMAL512
		default:
			log.Warn("unsupported hash size")
		}
	case packet.PubKeyAlgoECDH:
		switch hashSize {
		case 256:
			pk.Algorithm = ECDH256
		case 384:
			pk.Algorithm = ECDH384
		case 512:
			pk.Algorithm = ECDH512
		default:
			log.Warn("unsupported hash size")
		}
	default:
		log.Warn("unsupported public key")
	}

	// embed emails found in key to ease later lookup
	pk.Emails = emailsInKey
	return nil
}

func GetExpiryDate(s *packet.Signature) time.Time {
	if s.KeyLifetimeSecs != nil {
		return s.CreationTime.Add(time.Duration(*s.KeyLifetimeSecs) * time.Second)
	}
	return time.Time{}
}

// ExtractEmailAddrFromString returns the most left part email address pattern found in s
// or an empty string if pattern not found
func ExtractEmailAddrFromString(s string) string {
	r, _ := regexp.Compile(`[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+`)
	return r.FindString(s)
}

// GetTableInfos implements HasTable interface.
// It returns params needed by CassandraBackend to CRUD on PublicKey table.
func (pk *PublicKey) GetTableInfos() (table string, partitionKeys map[string]string, clusteringKeys map[string]string) {
	return "public_key",
		map[string]string{
			"UserId":     "user_id",
			"ResourceId": "resource_id",
			"KeyId":      "key_id",
		},
		map[string]string{
			"UserId":     "user_id",
			"ResourceId": "resource_id",
		}
}

func (pk *PublicKey) MarshallNew(contacts ...interface{}) {
	if len(pk.KeyId) == 0 || (bytes.Equal(pk.KeyId.Bytes(), EmptyUUID.Bytes())) {
		pk.KeyId.UnmarshalBinary(uuid.NewV4().Bytes())
	}
	if len(contacts) == 1 {
		c := contacts[0].(*Contact)
		pk.UserId.UnmarshalBinary(c.UserId.Bytes())
		pk.ResourceId.UnmarshalBinary(c.ContactId.Bytes())
		pk.ResourceType = ContactType
		// do not change date if mashallNew has been called multiple time on a publickey being created
		if pk.DateInsert.IsZero() {
			pk.DateInsert = time.Now()
		}
		if pk.DateUpdate.IsZero() {
			pk.DateUpdate = pk.DateInsert
		}
	}
}

// return a JSON representation of PublicKey suitable for frontend client
func (pk *PublicKey) MarshalFrontEnd() ([]byte, error) {
	return JSONMarshaller("frontend", pk)
}

func (pk *PublicKey) JSONMarshaller() ([]byte, error) {
	return JSONMarshaller("", pk)
}

func (pk *PublicKey) NewEmpty() interface{} {
	p := new(PublicKey)
	return p
}

/* ObjectPatchable interface */
func (pk *PublicKey) JsonTags() map[string]string {
	return jsonTags(pk)
}

func (pk *PublicKey) SortSlices() {
	// nothing to sort
}

type PublicKeys []PublicKey

// Sort interface implementation
type ByKeyId PublicKeys

func (p ByKeyId) Len() int {
	return len(p)
}

func (p ByKeyId) Less(i, j int) bool {
	return p[i].KeyId.String() < p[j].KeyId.String()
}

func (p ByKeyId) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}
