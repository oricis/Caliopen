# -*- coding: utf-8 -*-
"""Caliopen mail message privacy features extraction methods."""
from __future__ import absolute_import, print_function, unicode_literals

from caliopen_storage.config import Configuration


class MailPrivacyFeatureProcessor(object):
    """Process a parsed mail message and extract available privacy features."""

    _features = {
        'mail_emitter_mx_reputation': None,
        'mail_emitter_certificate': None,
        'transport_signed': False,
        'transport_signature': None,
        'message_signed': False,
        'message_crypted': False,
        'message_encryption_infos': None,
        'mail_agent': None,
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

    def _blacklist_mx(self, mx):
        blacklisted = Configuration('global').get('blacklistes.mx')
        if not blacklisted:
            return False
        if mx in blacklisted:
            return True
        return False

    def emitter_reputation(self, mx):
        """Return features about emitter."""
        if self._blacklist_mx(mx):
            return 'blacklisted'
        return None

    def emitter_certificate(self):
        """Get the certificate from emitter."""
        return None

    @property
    def mail_agent(self):
        """Get the mailer used for this message."""
        # XXX normalize better and more ?
        return self.message.mail.get('X-Mailer', '').lower()

    @property
    def transport_signature(self):
        """Get the transport signature if any."""
        return self.message.mail.get('DKIM-Signature')

    def process(self):
        """Process the message for privacy features extraction."""
        mx = self._get_message_mx()
        reputation = None if not mx else self.emitter_reputation(mx)
        self._features['mail_emitter_mx_reputation'] = reputation
        self._features['mail_emitter_certificate'] = self.emitter_certificate()
        is_signed = [x for x in self.message.attachments
                     if 'pgp-sign' in x.content_type]
        is_crypted = [x for x in self.message.attachments
                      if 'pgp-encrypt' in x.content_type]
        self._features.update({'message_signed': True if is_signed else False,
                               'message_crypted': True if is_crypted else False
                               })
        self._features['mail_agent'] = self.mail_agent
        signature = self.transport_signature
        if signature:
            self._features.update({'transport_siged': True,
                                   'transport_signature': signature})
        return self._features
