#!/usr/bin/env python
# coding: utf8
"""Extract recovery emails of registered users."""

from __future__ import unicode_literals

import argparse
import logging

from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import connect_storage
from cassandra.cqlengine.management import sync_table

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', dest='conffile')

    args = parser.parse_args()
    Configuration.load(args.conffile, 'global')
    connect_storage()
    from caliopen_main.message.store.message import Message

    log.info("updating model for table message")
    sync_table(Message)
    log.info("setting date_sort for {} messages".format(Message.objects().count()))
    for message in Message.all():
        if message.date_sort is None:
            message.date_sort = message.date_insert if message.is_received \
                else message.date
        message.update()