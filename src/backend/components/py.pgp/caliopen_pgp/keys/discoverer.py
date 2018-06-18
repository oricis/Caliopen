# -*- coding: utf-8 -*-
"""Manager for discovery logic."""

from __future__ import absolute_import, unicode_literals
import logging

from .keybase import KeybaseDiscovery
from .rfc7929 import DNSDiscovery
from .hkp import HKPDiscovery

log = logging.getLogger(__name__)


class PublicKeyDiscoverer(object):
    """Discover of public keys for a contact information."""

    discoverers = {}

    def __init__(self, conf):
        params = conf.get('key_discovery', {}).get('dns', {})
        if params.get('enable'):
            disco = DNSDiscovery(params)
            self.discoverers['dns'] = disco
        params = conf.get('key_discovery', {}).get('keybase', {})
        if params.get('enable'):
            disco = KeybaseDiscovery(params)
            self.discoverers['keybase'] = disco
        params = conf.get('key_discovery', {}).get('hkp', {})
        if params.get('enable'):
            disco = HKPDiscovery(params)
            self.discoverers['hkp'] = disco

    def find_by_type(self, identifier, type_):
        """Search for public key for an identifier and a protocol type."""
        found_keys = []
        for disco in self.discoverers:
            if type_ in self.discoverers[disco]._types:
                try:
                    fn = 'find_by_{}'.format(type_)
                    keys = getattr(self.discoverers[disco], fn)(identifier)
                    found_keys.extend(keys)
                except Exception as exc:
                    log.error('Exception during key lookup using {0} '
                              'for identifier {1}: {2}'.format(disco,
                                                               identifier,
                                                               exc))
        return found_keys
