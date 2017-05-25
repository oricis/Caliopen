# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import uuid
from .parameters import NewMessage, Participant, Attachment, PrivacyFeature

from caliopen_storage.exception import NotFound
from caliopen_main.objects.message import Message
from caliopen_main.user.core import Contact
from caliopen_main.discussion.core import (Discussion,
                                           DiscussionMessageLookup,
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
            log.info('Will lookup contact {} for user {}'.
                     format(participant.address, self.user.user_id))
            c = Contact.lookup(self.user, participant.address)
            if c:
                p.contact_id = c.contact_id
        except NotFound:
            pass
        return p

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

        for p in message.participants:
            new_message.participants.append(self.get_participant(message, p))

        for a in message.attachments:
            attachment = Attachment()
            attachment.content_type = a.content_type
            attachment.filename = a.filename
            attachment.size = a.size
            new_message.attachments.append(attachment)

        for feature, value in message.privacy_features.items():
            pf = PrivacyFeature()
            pf.name = feature
            pf.value = str(value)
            # XXX define type mapping
            pf.type = 'string'
            new_message.privacy_features.append(pf)
        # compute tags
        new_message.tags = self._get_tags(message)
        log.debug('Resolved tags {}'.format(new_message.tags))

        # lookup by external references
        lookup_sequence = message.lookup_discussion_sequence()
        lkp = self.lookup(lookup_sequence)
        log.debug('Lookup with sequence {} give {}'.
                  format(lookup_sequence, lkp))

        # Create or update existing discussion
        if not lkp:
            log.debug('Creating new discussion')
            discussion = Discussion.create_from_message(self.user, new_message)
        else:
            discussion = Discussion.get(self.user, lkp.discussion_id)

        discussion_id = discussion.discussion_id if discussion else None
        new_message.discussion_id = uuid.UUID(discussion_id)
        new_message.validate()
        # XXX missing discussion management

        # update and index the message
        obj = Message(self.user)
        obj.unmarshall_dict(new_message.to_native())
        obj.user_id = uuid.UUID(self.user.user_id)
        obj.message_id = uuid.uuid4()
        obj.marshall_db()
        obj.save_db()
        obj.marshall_index()
        obj.save_index()
        if not lkp:
            self.create_lookups(lookup_sequence, obj)
        return obj
