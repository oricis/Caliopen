import logging
from mailbox import Message as Rfc2822

from caliopen.config import Configuration
from caliopen.messaging.queue import Publisher
from caliopen.core.raw import RawMail
from caliopen.core.user import User

log = logging.getLogger(__name__)


class DeliveryAgent(object):
    """Main logic for delivery of a mail message"""

    def __init__(self):
        self.publisher = Publisher(Configuration('global').get('broker'))

    def process_user_mail(self, user, message_id):
        # XXX : logic here, for user rules etc
        qmsg = {'user_id': user.user_id, 'message_id': message_id}
        log.debug('Will publish %r' % qmsg)
        self.publisher.publish(qmsg)

    def resolve_users(self, rpcts):
        users = []
        for rcpt in rpcts:
            user = User.get(rcpt)
            users.append(user)
        return users

    def parse_mail(self, buf):
        try:
            mail = Rfc2822(buf)
        except Exception, exc:
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
            user_ids = [x.user_id for x in users]
            # Create raw mail
            log.debug('Will create raw mail for message-id %s and users %r' %
                      (message_id, user_ids))
            raw = RawMail.create(message_id, user_ids, buf)
            log.debug('Created raw mail %r' % raw.raw_id)
            for user in users:
                self.process_user_mail(user, message_id)
            return raw.raw_id
        else:
            log.warn('No user for mail')
