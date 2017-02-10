# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import logging
from mailbox import Message as Rfc2822

from caliopen_main.message.core import RawInboundMessage
from caliopen_main.user.core import User
from caliopen_main.message.delivery import UserMessageDelivery

log = logging.getLogger(__name__)


class DeliveryAgent(object):

    """Main logic for delivery of a mail message."""

    def __init__(self):
        self.direct = True
        self.deliver = UserMessageDelivery()

    def process_user_mail(self, user, raw_msg_id):
        # XXX : logic here, for user rules etc
        qmsg = {'user_id': user.user_id, 'raw_msg_id': raw_msg_id}
        log.debug('Will publish %r' % qmsg)
        self.deliver.process(user.user_id, raw_msg_id)

    def resolve_users(self, rpcts):
        users = []
        for rcpt in rpcts:
            user = User.by_local_identity(rcpt)
            users.append(user)
        return users

    def parse_mail(self, buf):
        try:
            mail = Rfc2822(buf)
        except Exception as exc:
            log.error('Parse message failed %s' % exc)
            raise
        if mail.defects:
            # XXX what to do ?
            log.warn('Defects on parsed mail %r' % mail.defects)
        return mail

    def process(self, mailfrom, rcpts, buf):
        """
        Process a mail from buffer, to deliver it to users that can be found
        """
        users = self.resolve_users(rcpts)
        if users:
            log.debug('Will create raw for users %r' %
                      [x.user_id for x in users])
            raw = RawInboundMessage.create(users, buf)
            log.debug('Created raw message %r' % raw.raw_msg_id)
            for user in users:
                self.process_user_mail(user, raw.raw_msg_id)
            return raw.raw_msg_id
        else:
            log.warn('No user for mail')
