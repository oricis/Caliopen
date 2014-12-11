#!/usr/bin/env python
import sys
import logging
import argparse

from pyramid.paster import get_appsettings, setup_logging
from pyramid.config import Configurator

from caliopen.core.config import includeme as include_caliop_core


from caliopen.config import Configuration
from caliopen.messaging.queue import Consumer


log = logging.getLogger(__name__)


def process_message(body, message):
    # XXX not import here, but configuration have to be loaded
    from caliopen.core.deliver import UserMessageDelivery
    deliver = UserMessageDelivery()
    log.info("Will process %r" % body)
    msg = deliver.process(body['user_id'], body['message_id'])
    log.info('Have deliver message %r' % (msg))
    message.ack()


def main(args=sys.argv):

    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile', default='development.ini')
    kwargs = parser.parse_args(args[1:])
    kwargs = vars(kwargs)

    config_uri = kwargs.pop('conffile')
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, u'main')
    # do not declare routes and others useless includes
    del settings['pyramid.includes']

    kwargs['settings'] = settings

    config = Configurator(settings=settings)

    include_caliop_core(config)

    consumer = Consumer(Configuration('global').get('broker'),
                        process_message)
    consumer.start()


if __name__ == '__main__':
    main()
