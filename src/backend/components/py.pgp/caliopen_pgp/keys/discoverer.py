# -*- coding: utf-8 -*-
"""
Manager for discovery logic
"""

from __future__ import absolute_import, unicode_literals


class PublicKeyDiscoverer(object):

    """Discover of public keys for a contact information."""

    discoverers = {}

    def __init__(self, conf):
        if conf.get('key_discovery.dns.enable'):
            disco = DnsKeyDiscovery(conf.get('key_discovery.dns'))
            self.discoverer['dns'] = disco

        if conf.get('key_discovery.keybase.enable'):
            disco = KeybaseKeyDiscovery(conf.get('key_discovery.keybase'))
            self.discoverer['keybase'] = disco

    def search_email(self, email):
        discoverers = ['dns']
        found_keys = []
        for disco in discoverers:
            if disco in self.discoverer:
                try:
                    key = self.discoverer[disco].search(email)
                    found_keys.append(key)
                except Exception as exc:
                    log.error('Exception during key lookup using {} for email {}'.
                              format(disco, email))
        return found_keys
