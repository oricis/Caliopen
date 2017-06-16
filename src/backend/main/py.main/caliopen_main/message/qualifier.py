# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
from .parameters import NewMessage, Participant, Attachment

from caliopen_storage.exception import NotFound
from caliopen_main.objects.pi import PIParameter
from caliopen_main.user.core import Contact
from caliopen_main.discussion.core import (DiscussionMessageLookup,
                                           DiscussionRecipientLookup,
                                           DiscussionExternalLookup)
# XXX use a message formatter registry not directly mail format
from caliopen_main.parsers import MailMessage

log = logging.getLogger(__name__)


class UserMessageQualifier(object):
    """
    Process a message to enhance it with.

        - tags
        - pi
        - discussion reference
        - etc.

    """

    _lookups = {
        'parent': DiscussionMessageLookup,
        'list': DiscussionRecipientLookup,
        'recipient': DiscussionRecipientLookup,
        'external_thread': DiscussionExternalLookup,
        'from': DiscussionRecipientLookup,
    }

    def __init__(self, user):
        """Create a new instance of an user message qualifier."""
        self.user = user

    def _get_tags(self, message):
        """Evaluate user rules to get all tags for a mail."""
        return []

    def lookup(self, sequence):
        """Process lookup sequence to find discussion to associate."""
        log.debug('Lookup sequence %r' % sequence)
        for prop in sequence:
            try:
                kls = self._lookups[prop[0]]
                log.debug('Will lookup %s with value %s' %
                          (prop[0], prop[1]))
                return kls.get(self.user, prop[1])
            except NotFound:
                log.debug('Lookup type %s with value %s failed' %
                          (prop[0], prop[1]))
        return None

    def create_lookups(self, sequence, message):
        """Initialize lookup classes for the related sequence."""
        for prop in sequence:
            kls = self._lookups[prop[0]]
            params = {
                kls._pkey_name: prop[1],
                'discussion_id': message.discussion_id
            }
            if 'message_id' in kls._model_class._columns.keys():
                params.update({'message_id': message.message_id})
            lookup = kls.create(self.user, **params)
            log.debug('Create lookup %r' % lookup)
            if prop[0] == 'list':
                return

    def get_participant(self, message, participant):
        """Try to find a related contact and return a Participant instance."""
        p = Participant()
        p.address = participant.address
        p.type = participant.type
        p.label = participant.label
        p.protocol = message.message_type
        try:
            log.debug('Will lookup contact {} for user {}'.
                      format(participant.address, self.user.user_id))
            c = Contact.lookup(self.user, participant.address)
            if c:
                p.contact_id = c.contact_id
        except NotFound:
            pass
        return p

    def _compute_pi(self, message):
        """Compute Privacy Indexes for a message."""
        feat = message.privacy_features
        pi_cx = 0   # Contextual privacy index
        pi_co = 0   # Comportemental privacy index
        pi_t = 0   # Technical privacy index
        reput = feat.get('mail_emitter_mx_reputation')
        if reput == 'whitelisted':
            pi_cx += 20
        elif reput == 'unknown':
            pi_cx += 10
        known_contacts = []
        known_public_key = 0
        for part in message.participants:
            if part.contact_ids:
                for cid in part.contact_ids:
                    contact = Contact.get(self.user, cid)
                    known_contacts.append(contact)
                    if contact.public_key:
                        known_public_key += 1
        if len(message.participants) == len(known_contacts):
            # XXX
            # - Si tous les contacts sont déjà connus le PIᶜˣ
            # augmente de la valeur du PIᶜᵒ le plus bas des PIᶜᵒ des contacts.
            if known_public_key == len(known_contacts):
                pi_co += 20
        ext_hops = feat.get('nb_external_hops', 0)
        if ext_hops <= 1:
            tls = feat.get('ingress_socket_version')
            if tls:
                tls = tls.replace('_', '.').lower()
                if tls == 'tlsv1/sslv3':
                    pi_t += 2
                elif tls in ('tls1', 'tlsv1'):
                    pi_t += 7
                elif tls == 'tls1.2':
                    pi_t += 10
                else:
                    log.warn('Unknown TLS version {}'.format(tls))
        if feat.get('mail_emitter_certificate'):
            pi_t += 10
        if feat.get('transport_signed'):
            pi_t += 10
        if feat.get('message_encrypted'):
            pi_t += 30
        return PIParameter({'technical': pi_t,
                            'context': pi_cx,
                            'comportment': pi_co,
                            'version': 0})

    def process_inbound(self, raw):
        """Process inbound message.

        @param raw: a RawMessage object
        @rtype: NewMessage
        """
        message = MailMessage(raw.raw_data)
        new_message = NewMessage()
        new_message.raw_msg_id = raw.raw_msg_id
        new_message.subject = message.subject
        new_message.body = message.body
        new_message.date = message.date
        new_message.size = message.size
        new_message.type = message.message_type
        new_message.is_unread = True
        new_message.is_draft = False
        new_message.is_answered = False
        new_message.importance_level = 0    # XXX tofix on parser
        new_message.external_references = message.external_references

        for k, v in message.privacy_features.items():
            if v is not None:
                # XXX hard typing
                new_message.privacy_features[k] = str(v)

        for p in message.participants:
            new_message.participants.append(self.get_participant(message, p))

        for a in message.attachments:
            attachment = Attachment()
            attachment.content_type = a.content_type
            attachment.filename = a.filename
            attachment.size = a.size
            new_message.attachments.append(attachment)

        # Compute PI !!
        new_message.pi = self._compute_pi(new_message)

        # compute tags
        new_message.tags = self._get_tags(message)
        log.debug('Resolved tags {}'.format(new_message.tags))

        # lookup by external references
        lookup_sequence = message.lookup_discussion_sequence()
        lkp = self.lookup(lookup_sequence)
        log.debug('Lookup with sequence {} give {}'.
                  format(lookup_sequence, lkp))

        if lkp:
            new_message.discussion_id = lkp.discussion_id
        new_message.privacy_indexes = self._compute_pi(new_message)
        new_message.validate()
        return new_message
        # XXX create lookup
