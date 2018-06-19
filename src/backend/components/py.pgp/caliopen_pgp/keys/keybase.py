# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

import logging

import requests

from .base import BaseDiscovery, DiscoveryResult

log = logging.getLogger(__name__)


class KeybaseDiscovery(BaseDiscovery):
    """Discover pgp keys and others contact identities in keybase."""

    KEYBASE_DEFAULT_BASE_URL = 'https://keybase.io'
    KEYBASE_DEFAULT_HEADERS = {'Content-Type': 'application/json'}
    DEFAULT_TIMEOUT = 10

    _types = ['twitter', 'github']

    def __init__(self, conf):
        self.base_url = conf.get('url', self.KEYBASE_DEFAULT_BASE_URL)
        self.url = '{}/_/api/1.0'.format(self.base_url)
        self.headers = conf.get('headers', self.KEYBASE_DEFAULT_HEADERS)
        self.timeout = conf.get('timeout', self.DEFAULT_TIMEOUT)

    def lookup_identifier(self, identifier, type_):
        """Find by name and type."""
        if type_ not in self._types:
            raise Exception('Invalid identity type {}'.format(type_))
        users = []
        find = self._fetch_identity(identifier, type_)
        if find:
            log.debug('Got keybase result : {}'.format(find))
            users.extend(find)
        keys = []
        for user in users:
            user_key = self._get_public_key(user['username'])
            if user_key:
                keys.append(user_key)
        public_keys = []
        for key in keys:
            public_keys.extend(self._parse_key(key))
        return DiscoveryResult(public_keys)

    def _clean_name(self, name, type_):
        """Format a clean user name depending on type."""
        if type_ == 'twitter':
            if name.startswith('@'):
                return name.lstrip('@').lower()
        return name.lower()

    def _fetch_identity(self, name, type_):
        """Make a user discover API call on keybase for a name and type."""
        clean_name = self._clean_name(name, type_)
        url = '{}/user/discover.json?{}={}'. \
              format(self.url, type_, clean_name)
        log.debug('Will query keybase url {}'.format(url))
        res = requests.get(url, headers=self.headers, timeout=self.timeout)
        if res.status_code != 200:
            log.error('Keybase discover status {} for {} on {}'.
                      format(res.status_code, clean_name, type_))
            return []
        result = res.json()
        if not result.get('matches'):
            log.debug('No match for keybase discovery of {} {}'.
                      format(clean_name, type_))
            return []
        matches = result['matches'].get(type_, [[]])
        res = []
        for match in matches:
            res.extend(match)
        return res

    def _get_public_key(self, username):
        """Fetch a public key for an user."""
        url = '{}/{}/key.asc'.format(self.base_url, username)
        log.debug('Will query keybase url {}'.format(url))
        res = requests.get(url, headers=self.headers, timeout=self.timeout)
        if res.status_code != 200:
            log.error('Keybase user key fetch status {} for {}'.
                      format(res.status_code, username))
            return None
        return res.text
