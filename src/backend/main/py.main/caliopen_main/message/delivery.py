# -*- coding: utf-8 -*-
"""Caliopen user message delivery logic."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from caliopen_storage.exception import NotFound
from ..user.core import User
from ..message.core import RawMessage
from .qualifier import UserMessageQualifier
from caliopen_main.parsers import MailMessage


log = logging.getLogger(__name__)


class UserMessageDelivery(object):
    """User message delivery processing."""

    def process_raw(self, user_id, raw_msg_id):
        """
        Process a raw message for an user, ie makes it a rich 'message'.

        the raw message must have been previously stored into db
        This process is triggered by a "process_raw_message" order on nats

        #### TODO : finish refactoring if we still need this func
                    as it is replaced by process_email_message below
        """
        try:
            raw = RawMessage.get(raw_msg_id)
        except NotFound:
            log.error('Raw message <{}> not found'.format(raw_msg_id))
            raise NotFound

        log.debug('Retrieved raw message {}'.format(raw_msg_id))
        user = User.get(user_id)
        if not user:
            log.error('user <{}> not found'.format(user_id))
            raise NotFound

        msg = MailMessage(raw)

        qualifier = UserMessageQualifier(user)
        message = qualifier.process_inbound(msg)
        return message
