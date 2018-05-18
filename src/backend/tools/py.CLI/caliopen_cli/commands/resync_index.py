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
log.setLevel(logging.DEBUG)


def resync_index(**kwargs):
    """Resync an index for an user."""
    from caliopen_main.user.core import User
    from caliopen_main.user.core.setups import setup_index
    from caliopen_main.contact.store import Contact
    from caliopen_main.contact.objects import Contact as ContactObject
    from caliopen_main.message.store import Message
    from caliopen_main.message.objects import Message as MessageObject

    if 'user_name' in kwargs and kwargs['user_name']:
        user = User.by_name(kwargs['user_name'])
    elif 'user_id' in kwargs and kwargs['user_id']:
        user = User.get(kwargs['user_id'])
    else:
        print('Need user_name or user_id parameter')
        sys.exit(1)

    mapping_key = 'elasticsearch.mappings_version'
    current_version = Configuration('global').get(mapping_key)
    new_index = '{}_{}'.format(user.user_id, current_version)

    if 'version' in kwargs and kwargs['version']:
        old_version = kwargs['version']
        old_index = '{}_{}'.format(user.user_id, old_version)
    else:
        old_index = new_index

    es_url = Configuration('global').get('elasticsearch.url')
    es_client = Elasticsearch(es_url)

    # Delete current index
    if not es_client.indices.exists([old_index]):
        log.warn('Index %r not found for user %s' % (old_index, user.name))
        sys.exit(1)
    es_client.indices.delete([old_index])
    log.info('Index %r deleted for user %s' % (old_index, user.name))

    # Recreate index and mappings
    setup_index(user)

    contacts = Contact.filter(user_id=user.user_id)
    for contact in contacts:
        log.debug('Reindex contact %r' % contact.contact_id)
        obj = ContactObject(user.user_id, contact_id=contact.contact_id)
        obj.create_index()

    messages = Message.filter(user_id=user.user_id).allow_filtering()
    for message in messages:
        log.debug('Reindex message %r' % message.message_id)
        obj = MessageObject(user.user_id, message_id=message.message_id)
        obj.create_index()
    log.info('Create index alias %r' % user.user_id)
    es_client.indices.put_alias(index=new_index, name=user.user_id)
