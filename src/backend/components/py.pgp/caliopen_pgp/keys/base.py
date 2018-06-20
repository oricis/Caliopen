# -*- coding: utf-8 -*-
"""
PGP public keys structures
"""
from __future__ import absolute_import, unicode_literals
import logging

import pgpy

log = logging.getLogger(__name__)


class PGPUserId(object):
    """PGP UserId related to a key."""

    def __init__(self, name, email, is_primary, comment=None, signers=None):
        self.name = name
        self.email = email
        self.is_primay = is_primary
        self.comment = comment
        self.signers = signers if signers else set()


class PGPPublicKey(object):
    """PGP public key representation."""

    _map_algos = {
        'DSA': 'dsa',
        'ECDH': 'ecdh',
        'ECDSA': 'ecdsa',
        'ElGamal': 'elgamal',
        'FormerlyElGamalEncryptOrSign': 'elgamal',
        'Invalid': 'unknown',
        'RSAEncrypt': 'rsa',
        'RSAEncryptOrSign': 'rsa',
        'RSASign': 'rsa',
    }

    def __init__(self, keyid, public_key):
        assert public_key.is_public, 'Not a public PGP key'
        self.id = keyid
        self._pgpkey = public_key
        self.version = public_key._key.header.version
        self.created = public_key.created
        # self.expire_at = public_key.expire_at
        self.is_expired = public_key.is_expired
        self.keyid = public_key.fingerprint.keyid
        self.fingerprint = public_key.fingerprint.replace(' ', '')
        self.algorithm = self._map_algos.get(public_key.key_algorithm.name,
                                             'unknown')

        self.userids = self._get_userids(public_key.userids)
        if public_key.subkeys:
            self.subkeys = [PGPPublicKey(k, v)
                            for k, v in public_key.subkeys.items()]
        else:
            self.subkeys = []
        if self.algorithm == 'rsa':
            self.size = public_key._key.keymaterial.n.bit_length()
            self.e = public_key._key.keymaterial.e
        else:
            self.size = 0
            self.e = 0

    def _get_userids(self, ids):
        """Return list of ``PgpUserId``."""
        return [PGPUserId(u.name, u.email, u.is_primary, u.comment, u.signers)
                for u in ids]

    @property
    def armored_key(self):
        """Return the armored key."""
        return str(self._pgpkey)


class DiscoveryResult(object):
    """Class to produce discovered public keys and extra informations."""

    def __init__(self, keys, extra_identities=None):
        self.keys = keys
        self.identities = extra_identities if extra_identities else []


class BaseDiscovery(object):
    """Base class for discovery and public key parsing logic."""

    @property
    def empty_result(self):
        """No result found."""
        return DiscoveryResult([])

    def lookup_identity(self, identity, type_):
        """Method to be implemented by sub class for discovery."""
        raise NotImplementedError

    def _parse_key(self, armored):
        pgpkey = pgpy.PGPKey()
        try:
            parse_result = pgpkey.parse(armored)
            log.debug('Parse key result {}'.format(parse_result))
            result_keys = []
            for keyid, parsedkey in parse_result.items():
                        result_keys.append(PGPPublicKey(keyid[0],
                                                        parsedkey))
            return result_keys
        except Exception as exc:
            log.error('Parse key failed {}'.format(exc))
            return []
