# -*- coding: utf-8 -*-
"""Caliopen mail message privacy features extraction methods."""
from __future__ import absolute_import, print_function, unicode_literals

import re
import logging

import pgpy

from caliopen_storage.config import Configuration


log = logging.getLogger(__name__)


class MailPrivacyFeature(object):
    """Process a parsed mail message and extract available privacy features."""

    _features = {
        'mail_emitter_mx_reputation': None,
        'mail_emitter_certificate': None,
        'transport_signed': False,
        'message_signed': False,
        'message_signature_type': None,
        'message_signer': None,
        'message_encrypted': False,
        'message_encryption_infos': None,
        'mail_agent': None,
        'spam_score': 0,
        'ingress_socket_version': None,
        'ingress_cipher': None,
        'ingress_server': None,
        'nb_external_hops': 0,
    }

    def __init__(self, message):
        """Get a ``MailMessage`` instance and extract privacy features."""
        self.message = message

    def is_blacklist_mx(self, mx):
        """MX is blacklisted."""
        blacklisted = Configuration('global').get('blacklistes.mx')
        if not blacklisted:
            return False
        if mx in blacklisted:
            return True
        return False

    def is_whitelist_mx(self, mx):
        """MX is whitelisted."""
        whitelistes = Configuration('global').get('whitelistes.mx')
        if not whitelistes:
            return False
        if mx in whitelistes:
            return True
        return False

    @property
    def internal_domains(self):
        """Get internal hosts from configuration."""
        domains = Configuration('global').get('internal_domains')
        return domains if domains else []

    def emitter_reputation(self, mx):
        """Return features about emitter."""
        if self.is_blacklist_mx(mx):
            return 'blacklisted'
        if self.is_whitelist_mx(mx):
            return 'whitelisted'
        return 'unknown'

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

    @property
    def spam_informations(self):
        """Compute features around spam information in mail headers."""
        scores = [0.0]
        score = self.message.mail.get('X-Spam-Score', 0)
        if score:
            try:
                score = float(score)
                scores.append(score * 10)
            except TypeError:
                log.debug('Invalid type for X-Spam-Score value {}'.
                          format(score))
        level = self.message.mail.get('X-Spam-Level', '')
        if '*' in level:
            # SpamAssassin style, level is *** notation, up to 25 *
            note = level.count('*')
            scores.append(min(100.0, note * 4.0))
        status = self.message.mail.get('X-Spam-Status', '')
        if status:
            match = re.match('^X-Spam-Status: Yes, score=(\d.\d).*', status)
            if match:
                scores.append(min(100.0, float(match[0] * 10)))

        if len(scores) == 1:
            # Really not a SPAM ? (and moderate effect of this flag)
            flag = self.message.mail.get('X-Spam-Flag', '')
            if flag.lower().startswith('y'):
                scores.append(80.0)

        return {'spam_score': max(scores)}

    def get_signature_informations(self):
        """Get message signature features."""
        signed_parts = [x for x in self.message.attachments
                        if 'pgp-sign' in x.content_type]
        if not signed_parts:
            return {}
        sign = pgpy.PGPSignature()
        features = {'message_signed': True,
                    'message_signature_type': 'PGP'}
        try:
            sign.parse(signed_parts[0].data)
            features.update({'message_signer': sign.signer})
        except Exception as exc:
            log.error('Unable to parse pgp signature {}'.format(exc))
        return features

    def get_encryption_informations(self):
        """Get message encryption features."""
        encrypted_parts = [x for x in self.message.attachments
                           if 'pgp-encrypt' in x.content_type]
        is_encrypted = True if encrypted_parts else False
        return {'message_encrypted': is_encrypted}

    def get_ingress_features(self):
        """Try to find information about ingress server that send this mail."""
        def get_host(line):
            if ' ' not in line:
                return None
            parts = line.split(' ')
            return parts[0]

        def parse_ingress(header):
            header = header.replace('\n', '')
            search = re.compile(r'.*using (\S+) with cipher ([\S-]+)',
                                re.MULTILINE)
            match = search.match(header)
            if match:
                return match.groups()
            return None

        found_features = {}
        received = self.message.headers.get('Received')
        if not received:
            return {}

        # First step Search for 'paths' (from / by) information
        search = re.compile(r'^from (.*) by (.*)', re.MULTILINE + re.DOTALL)
        paths = []
        for r in received:
            r = r.replace('\n', '')
            match = search.match(r)
            if match:
                groups = match.groups()
                from_ = get_host(groups[0])
                by = get_host(groups[1])
                if from_ and by:
                    paths.append((from_, by, groups))
                else:
                    log.warn('Invalid from {} or by {} path in {}'.
                             format(from_, by, r))
            else:
                if r.startswith('by'):
                    # XXX first hop, to consider ?
                    pass
                else:
                    log.warn('Received header, does not match format {}'.
                             format(r))

        # Second step: qualify path if internal and try to find the ingress one
        ingress = None
        internal_hops = 0
        for path in paths:
            is_internal = False
            for internal in self.internal_domains:
                if internal in path[0]:
                    is_internal = True
                else:
                    if internal in path[1] and internal not in path[0]:
                        ingress = path
                        break
            if is_internal:
                internal_hops += 1

        # Qualify ingress connection
        if ingress:
            cnx_info = parse_ingress(ingress[2][0])
            if cnx_info and len(cnx_info) > 1:
                found_features.update({'ingress_socket_version': cnx_info[0],
                                       'ingress_cipher': cnx_info[1]})
            found_features.update({'ingress_server': ingress[0]})

        # Try to count external hops
        external_hops = len(paths) - internal_hops
        found_features.update({'nb_external_hops': external_hops})
        return found_features

    def process(self):
        """Process the message for privacy features extraction."""
        features = self._features.copy()
        features.update(self.get_ingress_features())
        mx = features.get('ingress_server')
        reputation = None if not mx else self.emitter_reputation(mx)
        features['mail_emitter_mx_reputation'] = reputation
        features['mail_emitter_certificate'] = self.emitter_certificate()
        features['mail_agent'] = self.mail_agent
        features.update(self.get_signature_informations())
        features.update(self.get_encryption_informations())
        features.update(self.spam_informations)

        if self.transport_signature:
            features.update({'transport_signed': True})
        return features
