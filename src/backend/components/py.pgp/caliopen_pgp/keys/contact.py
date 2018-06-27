"""Caliopen contact public keys logic."""

import logging


from caliopen_pgp.keys import PublicKeyDiscoverer
from caliopen_storage.config import Configuration
from caliopen_main.common.core import PublicKey

log = logging.getLogger(__name__)


class ContactDiscoveryResult(object):
    """Store discovery results for a contact."""

    def __init__(self):
        """Instanciate a `ContactDiscoveryResult`."""
        self.keys = []
        self.emails = []
        self.identities = []


class ContactPublicKeyManager(object):
    """Manage contact public keys."""

    def __init__(self):
        """Instanciate a `ContactPublicKeyManager`."""
        conf = Configuration('global').configuration
        self.discoverer = PublicKeyDiscoverer(conf)

    def _find_keys(self, user, contact, new_identifier, type_):
        """Find keys related to a new identifier for a contact."""
        results = self.discoverer.lookup_identity(new_identifier, type_)
        current_keys = PublicKey.find(user, contact.contact_id)
        known_keys = [x.fingerprint for x in current_keys]
        new_keys = []
        if results:
            for result in results:
                for key in result.keys:
                    if key.fingerprint not in known_keys:
                        log.info('Found new key {0}'.format(key.fingerprint))
                        new_keys.append(result)
                    else:
                        log.info('Known key {0}'.format(key.fingerprint))
        return new_keys

    def _filter_new_emails(self, contact, key):
        """Find new emails related to a contact public key."""
        known_emails = [x.address for x in contact.emails]
        for userid in key.userids:
            if userid.email not in known_emails:
                known_emails.append(userid.email)
                yield userid

    def _filter_new_identities(self, contact, identities):
        """Create new identities found for a contact."""
        known_ids = [(x.type, x.name) for x in contact.identities]
        for identity in identities:
            if identity not in known_ids:
                yield identity

    def process_contact_identity(self, user, contact, new_identifier, type_):
        """Process a contact new identity."""
        result = ContactDiscoveryResult()
        discovers = self._find_keys(user, contact, new_identifier, type_)
        found_emails = []
        found_ids = []
        for disco in discovers:
            for key in disco.keys:
                result.keys.append(key)
                found_emails.extend(self._filter_new_emails(contact, key))
            if disco.identities:
                ids = self._filter_new_identities(contact, disco.identities)
                found_ids.extend(ids)
        for email in found_emails:
            if email.email not in [x.email for x in result.emails]:
                result.emails.append(email)
        for identity in found_ids:
            if identity not in result.identities:
                result.identities.append(identity)
        return result
