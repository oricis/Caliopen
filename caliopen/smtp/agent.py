import logging
from mailbox import Message as Rfc2822

from caliopen.base.config import Configuration
from caliopen.messaging.queue import Publisher
from caliopen.base.message.core.message import RawMessage
from caliopen.base.user.core import User
from caliopen.base.message.delivery import UserMessageDelivery

log = logging.getLogger(__name__)


class DeliveryAgent(object):

    """Main logic for delivery of a mail message."""

    def __init__(self):
        conf = Configuration('global').get('delivery_agent')
        if conf.get('direct', False):
            self.direct = True
            self.deliver = UserMessageDelivery()
        else:
            if not conf.get('broker'):
                raise Exception('Missing broker configuration')
            self.direct = False
            self.publisher = Publisher(conf['broker'])

    def process_user_mail(self, user, message_id):
        # XXX : logic here, for user rules etc
        qmsg = {'user_id': user.user_id, 'message_id': message_id}
        log.debug('Will publish %r' % qmsg)
        if not self.direct:
            self.publisher.publish(qmsg)
        else:
            udeliver = UserMessageDelivery()
            udeliver.process(user.user_id, message_id)

    def resolve_users(self, rpcts):
        users = []
        for rcpt in rpcts:
            user = User.by_name(rcpt)
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
            mail = self.parse_mail(buf)
            message_id = mail.get('Message-ID')
            if not message_id:
                raise Exception('No Message-ID found')
            for user in users:
                # Create raw message
                log.debug('Will create raw for message-id %s and user %r' %
                          (message_id, user.user_id))
                raw = RawMessage.create(user, message_id, buf)
                log.debug('Created raw message %r' % raw.raw_id)
                self.process_user_mail(user, message_id)
            return raw.raw_id
        else:
            log.warn('No user for mail')
