# -*- coding: utf-8 -*-
"""Caliopen mail message privacy features extraction methods."""
from __future__ import absolute_import, print_function, unicode_literals

from caliopen_storage.config import Configuration


class MailPrivacyFeatureProcessor(object):
    """Process a parsed mail message and extract available privacy features."""

    _features = {
        'mail_emitter_mx_reputation': None,
        'mail_emitter_certificate': None,
        'mail_transport_signed': False,
        'message_signed': False,
        'message_crypted': False,
        'message_encryption_infos': None,
    }

    def __init__(self, message):
        """Get a ``MailMessage`` instance and extract privacy features."""
        self.message = message

    def _get_message_mx(self):
        headers = self.message.headers.get('Received', [])
        # XXX parse headers better to get the valuable emitter
        if headers:
            return headers[0]
        return None

    def _blacklist_mx(self):
        blacklisted = Configuration('global').get('blacklistes.mx')
        if not blacklisted:
            return False
        message_mx = self._get_message_mx()
        if message_mx in blacklisted:
            return True
        return False

    def emitter_reputation(self):
        """Return features about emitter."""
        if self._blacklist_mx():
            return 'blacklisted'
        else:
            return 'normal'

    def emitter_certificate(self):
        """Get the certificate from emitter."""
        return None

    def process(self):
        """Process the message for privacy features extraction."""
        mx = self._get_message_mx()
        reputation = None if not mx else self.emitter_reputation()
        self._features['mail_emitter_mx_reputation'] = reputation
        self._features['mail_emitter_certificate'] = self.emitter_certificate()
        return self._features
