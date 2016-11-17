#!/usr/bin/env python
import sys
import logging
import argparse

from caliopen.base.config import Configuration
from caliopen.messaging.queue import Consumer


log = logging.getLogger(__name__)


def process_message(body, message):
    # XXX not import here, but configuration have to be loaded
    from caliopen.base.message.deliver import UserMessageDelivery
    deliver = UserMessageDelivery()
    log.info("Will process %r" % body)
    msg = deliver.process(body['user_id'], body['message_id'])
    log.info('Have deliver message %r' % (msg))
    message.ack()


def main(args=sys.argv):

    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile')
    kwargs = parser.parse_args(args[1:])
    kwargs = vars(kwargs)

    config_file = kwargs.pop('conffile')
    Configuration.load(config_file, 'global')

    consumer = Consumer(Configuration('global').get('broker'),
                        process_message)
    consumer.start()


if __name__ == '__main__':
    main()
