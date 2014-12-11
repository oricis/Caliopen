import logging
from gsmtpd import LMTPServer
from cqlengine import connection

from caliopen.config import Configuration

Configuration.load('caliopen.yaml', 'global')
connection.setup(['127.0.0.1:9160'])

from caliopen.core.config import includeme
includeme(None)

log = logging.getLogger(__name__)
from caliopen.smtp.agent import DeliveryAgent


class LmtpServer(LMTPServer):
    def process_message(self, peer, mailfrom, rcpttos, data):
        agent = DeliveryAgent()
        messages = agent.process(mailfrom, rcpttos, data)
        log.info('Deliver of %d messages' % len(messages))
        return None


if __name__ == '__main__':
    s = LmtpServer(("127.0.0.1", 4000))
    s.serve_forever()
