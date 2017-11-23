# -*- coding: utf-8 -*-
"""new user related logic"""

from __future__ import absolute_import, print_function, unicode_literals

import logging
import datetime
import pytz

from caliopen_storage.config import Configuration
from elasticsearch import Elasticsearch
from caliopen_storage.core import BaseCore, BaseUserCore, core_registry
from caliopen_main.user.objects.settings import Settings as ObjectSettings

log = logging.getLogger(__name__)


def setup_index(user):
    """Creates user index and setups mappings."""
    url = Configuration('global').get('elasticsearch.url')
    client = Elasticsearch(url)
    log.debug('Creating index for user {}'.format(user.user_id))
    if not client.indices.exists(user.user_id):
        client.indices.create(user.user_id)
    else:
        log.warn('Index already exist {}'.format(user.user_id))

    for name, kls in core_registry.items():
        if hasattr(kls, "_index_class") and \
                hasattr(kls._model_class, 'user_id'):
            idx_kls = kls._index_class()
            log.debug('Init index for {}'.format(idx_kls))
            if hasattr(idx_kls, 'create_mapping'):
                log.info('Create index {} mapping for doc_type {}'.
                         format(user.user_id, idx_kls.doc_type))
                idx_kls.create_mapping(user.user_id)


def setup_system_tags(user):
    """Create system tags."""
    # TODO: translate tags'name to user's preferred language
    default_tags = Configuration('global').get('system.default_tags')
    for tag in default_tags:
        tag['type'] = 'system'
        tag['date_insert'] = datetime.datetime.now(tz=pytz.utc)
        from .user import Tag
        Tag.create(user, **tag)


def setup_settings(user, settings):
    """Create settings related to user."""
    # XXX set correct values

    settings = {
        'user_id': user.user_id,
        'default_locale': settings.default_locale,
        'message_display_format': settings.message_display_format,
        'contact_display_order': settings.contact_display_order,
        'contact_display_format': settings.contact_display_format,
        'notification_enabled': settings.notification_enabled,
        'notification_message_preview':
            settings.notification_message_preview,
        'notification_sound_enabled':
            settings.notification_sound_enabled,
        'notification_delay_disappear':
            settings.notification_delay_disappear,
    }

    obj = ObjectSettings(user.user_id)
    obj.unmarshall_dict(settings)
    obj.marshall_db()
    obj.save_db()
    return True
