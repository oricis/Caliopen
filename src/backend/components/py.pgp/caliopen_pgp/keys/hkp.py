# -*- coding: utf-8 -*-
"""HKP pgp key protocol dead simple implementation.

https://tools.ietf.org/html/draft-shaw-openpgp-hkp-00

"""
from __future__ import absolute_import, unicode_literals

from datetime import datetime
import urllib
import logging

import requests

from .base import BaseDiscovery

log = logging.getLogger(__name__)


def check_version(record):
    # TODO complete
    assert len(record) > 1


def parse_date(date):
    return datetime.fromtimestamp(float(date)) if date else None


def parse_pubkey_record(record):
    pub, keyid, algo, keylen, create, expire, flags = record.split(':', 7)
    return keyid


def parse_uid_record(record):
    uid, value, create, expire, flags = record.split(':')


def parse_search_result(lines):
    assert len(lines) > 2, 'Not enough lines'
    keyids = []
    for i in range(0, len(lines)):
        if i == 0:
            check_version(lines[0])
        elif i == 1:
            if not lines[i].startswith('pub:'):
                raise Exception('Not a public key record: {}'.format(lines[i]))
        if lines[i].startswith('pub:'):
            key = parse_pubkey_record(lines[i])
            keyids.append(key)
    return keyids


class HKPDiscovery(BaseDiscovery):

    DEFAULT_HKP_URL = 'http://pgp.mit.edu/pks/lookup'

    def __init__(self, conf):
        self.url = conf.get('url', self.DEFAULT_HKP_URL)

    def find_by_email(self, email):
        """Find pgp keys by user email."""
        pub_keys = self._search_keys(email)
        result_keys = []
        for key in pub_keys:
            asc_key = self._search_key(key)
            if not asc_key:
                log.warn('Key {} not found on HKP server'.format(key))
            else:
                txt_key = asc_key.encode('utf-8').rstrip()
                result_keys.extend(self._parse_key(txt_key))
        return result_keys

    def _search_keys(self, email):
        encoded = urllib.quote(email)
        url = '{}?search={}&op=index&options=mr'.format(self.url, encoded)
        res = requests.get(url)
        if res.status_code != 200:
            log.error('HKP discover status {} for {}'.
                      format(res.status_code, email))
            return []
        try:
            search_keys = parse_search_result(res.text.split('\n'))
            return search_keys
        except AssertionError as exc:
            log.error('Parse result failed during HKP search for {}: {}'.
                      format(email, exc))
        except Exception as exc:
            log.error('Unhandled exception during HKP search for {}: {}'.
                      format(email, exc))
        return []

    def _search_key(self, keyid):
        url = '{}?search=0x{}&op=get&options=mr'.format(self.url, keyid)
        res = requests.get(url)
        if res.status_code != 200:
            log.error('HKP discover status {} for {}'.
                      format(res.status_code, keyid))
            return None
        return res.text
