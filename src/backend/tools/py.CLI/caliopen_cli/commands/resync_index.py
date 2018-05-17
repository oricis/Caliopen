# -*- coding: utf-8 -*-

# resync index. This command will delete the current index for an user
# And rebuild it entirely using cassandra data
#

from __future__ import absolute_import, print_function, unicode_literals

import logging
import sys
from elasticsearch import Elasticsearch
from caliopen_storage.config import Configuration

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


def resync_index(user_name, **kwargs):
    """Resync an index for an user."""
    from caliopen_main.user.core import User
    from caliopen_main.user.core.setups import setup_index
    from caliopen_main.contact.store import Contact
    from caliopen_main.contact.objects import Contact as ContactObject
    from caliopen_main.message.store import Message
    from caliopen_main.message.objects import Message as MessageObject

    user = User.by_name(user_name)

    # Delete current index
    es_url = Configuration('global').get('elasticsearch.url')
    es_client = Elasticsearch(es_url)
    if not es_client.indices.exists([user.user_id]):
        log.warn('Index not found for user %s' % user_name)
        sys.exit(1)
    es_client.indices.delete([user.user_id])
    log.info('Index %r deleted for user %s' % (user.user_id, user_name))
    setup_index(user)

    contacts = Contact.filter(user_id=user.user_id)
    for contact in contacts:
        log.info('Reindex contact %r' % contact.contact_id)
        obj = ContactObject(user.user_id, contact_id=contact.contact_id)
        obj.create_index()

    messages = Message.filter(user_id=user.user_id).allow_filtering()
    for message in messages:
        log.info('Reindex message %r' % message.message_id)
        obj = MessageObject(user.user_id, message_id=message.message_id)
        obj.create_index()
