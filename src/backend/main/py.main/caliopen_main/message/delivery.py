# -*- coding: utf-8 -*-
"""Caliopen user message delivery logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import uuid

from caliopen_storage.exception import NotFound
from ..message.core import RawMessage
from .qualifier import UserMessageQualifier
from ..discussion.core import Discussion
from ..objects.message import Message

log = logging.getLogger(__name__)


class UserMessageDelivery(object):
    """User message delivery processing."""

    def __init__(self, user):
        """Create a new UserMessageDelivery belong to an user."""
        self.user = user

    def process_raw(self, raw_msg_id):
        """Process a raw message for an user, ie makes it a rich 'message'."""
        raw = RawMessage.get(raw_msg_id)
        if not raw:
            log.error('Raw message <{}> not found'.format(raw_msg_id))
            raise NotFound
        log.debug('Retrieved raw message {}'.format(raw_msg_id))

        qualifier = UserMessageQualifier(self.user)
        message = qualifier.process_inbound(raw)
        if not message.discussion_id:
            discussion = Discussion.create_from_message(self.user, message)
            log.debug('Created discussion {}'.format(discussion.discussion_id))
            # xxx create lookup ?
            message.discussion_id = discussion.discussion_id

        # store and index message
        obj = Message(self.user)
        obj.unmarshall_dict(message.to_native())
        obj.user_id = uuid.UUID(self.user.user_id)
        obj.message_id = uuid.uuid4()
        obj.marshall_db()
        obj.save_db()
        obj.marshall_index()
        obj.save_index()
        return obj
