#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import sys
import logging
import argparse
from gsmtpd import LMTPServer

from caliopen.base.config import Configuration


log = logging.getLogger(__name__)


class LmtpServer(LMTPServer):

    """Dead simple lmtp server to deliver message to a caliopen instance."""

    def process_message(self, peer, mailfrom, rcpttos, data):
        """Process a mail message."""
        # XXX can't import globally, configuration have to be loaded
        from caliopen.smtp.agent import DeliveryAgent
        agent = DeliveryAgent()
        log.debug('Receive peer {} from {} to {}'.
                  format(peer, mailfrom, rcpttos))
        messages = agent.process(mailfrom, rcpttos, data)
        log.info('Deliver of %d messages' % len(messages))
        return None


if __name__ == '__main__':
    args = sys.argv
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile')
    kwargs = parser.parse_args(args[1:])
    kwargs = vars(kwargs)
    Configuration.load(kwargs['conffile'], 'global')
    bind_address = Configuration('global').get('lmtp.bind_address',
                                               '127.0.0.1')
    port = Configuration('global').get('lmtp.port', 4000)
    s = LmtpServer((bind_address, port))
    s.serve_forever()
