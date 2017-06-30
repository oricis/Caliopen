// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package Privacy_Index

import (
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"time"
	"context"
)

func UpdatePIContactIdentity(ctx context.Context, contact Contact, identity *ContactIdentity) {
	// TODO: real update. But how to do it ???
	// ctx should be use to pass context information to this calculator
	// few computations below are just for demonstration

	if contact.PrivacyIndex != nil {
		identity.PrivacyIndex.Comportment = contact.PrivacyIndex.Comportment
		identity.PrivacyIndex.Context = contact.PrivacyIndex.Context
		identity.PrivacyIndex.Technic = contact.PrivacyIndex.Technic
		switch identity.Protocol {
		case "email":
			identity.PrivacyIndex.Technic--
		case "telephone":
			identity.PrivacyIndex.Technic++
		case "im":
			identity.PrivacyIndex.Technic -= 2
		}
		identity.PrivacyIndex.Technic = contact.PrivacyIndex.Technic
	} else {
		identity.PrivacyIndex = PrivacyIndex{}
	}

	identity.PrivacyIndex.DateUpdate = time.Now()
}
