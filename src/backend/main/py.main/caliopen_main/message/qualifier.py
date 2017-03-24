# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from uuid import UUID
from caliopen_storage.exception import NotFound
from ..user.core import User

from caliopen_main.objects.message import Message
from caliopen_main.objects.tag import ResourceTag

from ..message.core import (Discussion, DiscussionMessageLookup,
                            DiscussionRecipientLookup,
                            DiscussionExternalLookup)

# XXX use a message formatter registry not directly mail format
from ..message.format import MailMessage

log = logging.getLogger(__name__)


class UserMessageQualifier(Message):
    """
    Process a message to enhance it with :
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

    def _get_tags(self, user, mail):
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

    def lookup(self, user, sequence):
        """Process lookup sequence to find discussion to associate."""
        log.debug('Lookup sequence %r' % sequence)
        for prop in sequence:
            try:
                kls = self._lookups[prop[0]]
                log.debug('Will lookup %s with value %s' %
                          (prop[0], prop[1]))
                return kls.get(user, prop[1])
            except NotFound:
                log.debug('Lookup type %s with value %s failed' %
                          (prop[0], prop[1]))
        return None

    def __init_lookups(self, user, sequence, message):
        for prop in sequence:
            kls = self._lookups[prop[0]]
            params = {
                kls._pkey_name: prop[1],
                'discussion_id': message.discussion_id
            }
            if 'message_id' in kls._model_class._columns.keys():
                params.update({'message_id': message.message_id})
            lookup = kls.create(user, **params)
            log.debug('Create lookup %r' % lookup)
            if prop[0] == 'list':
                return

    def process_inbound(self):

        print("starting processing")
        user = User.get(self.user_id)
        raw_email = MailMessage(self.raw)

        # compute tags
        self.tags = self._get_tags(user, raw_email)
        log.debug('Resolved tags {}'.format(self.tags))

        # fill external references
        externals = self.external_references
        externals.message_id = raw_email.external_message_id
        externals.parent_id = raw_email.external_parent_id

        # lookup by external references
        lookup_sequence = raw_email.lookup_sequence()
        lookup = self.lookup(user, lookup_sequence)

        # Create or update existing discussion
        if lookup:
            log.debug('Found discussion %r' % lookup.discussion_id)
            discussion = Discussion.get(user, lookup.discussion_id)
            discussion.update_from_message(self)
        else:
            log.debug('Creating new discussion')
            discussion = Discussion.create_from_message(user, self)

        discussion_id = discussion.discussion_id if discussion else None
        self.discussion_id = UUID(discussion_id)
        # XXX missing discussion management

        # XXX Init lookup
        if not lookup:
            self.__init_lookups(user, lookup_sequence, self)
        else:
            if externals.message_id:
                params = {
                    'external_message_id': externals.message_id,
                    'discussion_id': discussion_id,
                    'message_id': externals.message_id,
                }
                new_lookup = DiscussionMessageLookup.create(user, **params)
                log.debug('Created message lookup %r' % new_lookup)

        # update and index the message
        # message.model.lookup = lookup

        self.marshall_db()
        self.update_db()
        self.marshall_index()
        self.save_index()
        # self.update_index()
