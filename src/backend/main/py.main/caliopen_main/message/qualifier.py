# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import uuid
from caliopen_storage.exception import NotFound
from caliopen_main.objects.message import Message
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

    def _get_tags(self, mail):
        """Evaluate user rules to get all tags for a mail."""
        tags = []
        # TODO: implement with current tag model
        # for rule in user.rules:
        #     res, stop = rule.eval(mail)
        #     if res:
        #         tags.extend(res)
        #     if stop:
        #         break
        return tags

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

    def __init_lookups(self, sequence, message):
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

    def process_inbound(self, raw):
        """Process inbound message."""
        # TODO: make use of json raw message (already stored in db)
        raw_email = MailMessage(raw)
        new_message = raw_email.parse()

        # compute tags
        new_message.tags = self._get_tags(raw_email)
        log.debug('Resolved tags {}'.format(new_message.tags))

        # lookup by external references
        lookup_sequence = raw_email.lookup_sequence()
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
        message = Message(self.user)
        message.unmarshall_dict(new_message.to_native())
        message.user_id = uuid.UUID(self.user.user_id)
        message.message_id = uuid.uuid4()
        message.marshall_db()
        message.save_db()
        message.marshall_index()
        message.save_index()
        return message
