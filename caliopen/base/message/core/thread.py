# -*- coding: utf-8 -*-
"""Caliopen core thread related classes."""

import logging
from datetime import datetime

from caliopen.base.exception import NotFound
from caliopen.base.core import BaseUserCore
from caliopen.base.core.mixin import MixinCoreIndex
from caliopen.base.parameters import ReturnIndexObject

from caliopen.base.user.core import Contact

from caliopen.base.message.model import  \
    (ThreadExternalLookup as ModelExternalLookup,
     ThreadRecipientLookup as ModelRecipientLookup,
     ThreadMessageLookup as ModelMessageLookup,
     Thread as ModelThread, IndexedThread)
from caliopen.base.message.parameters import Thread as ThreadParam


log = logging.getLogger(__name__)


class ThreadExternalLookup(BaseUserCore):

    """Lookup thread by external id (facebook, gmail, ...)."""

    _model_class = ModelExternalLookup
    _pkey_name = 'external_id'


class ThreadRecipientLookup(BaseUserCore):

    """Lookup thread for a recipient, only one."""

    _model_class = ModelRecipientLookup
    _pkey_name = 'recipient_name'


class ThreadMessageLookup(BaseUserCore):

    """Lookup thread by external message_id."""

    _model_class = ModelMessageLookup
    _pkey_name = 'external_message_id'


class Thread(BaseUserCore, MixinCoreIndex):

    """Thread core object."""

    _model_class = ModelThread
    _index_class = IndexedThread

    _pkey_name = 'thread_id'

    @classmethod
    def create_from_message(cls, user, message):
        new_id = user.new_thread_id()
        contacts = [contact.to_primitive()
                    for contact in message.recipients]
        kwargs = {'user_id': user.user_id,
                  'thread_id': new_id,
                  'date_insert': datetime.utcnow(),
                  'security_level': message.security_level,
                  'subject': message.subject,
                  '_indexed_extra': {'date_update': datetime.utcnow(),
                                     'slug': message.text[:200],
                                     'contacts': contacts, }
                  }
        if message.tags:
            kwargs['_indexed_extra']['tags'] = message.tags
        thread = cls.create(**kwargs)
        log.debug('Created thread %s' % thread.thread_id)
        return thread

    def update_from_message(self, message):
        # XXX concurrency will have to be considered correctly
        if message.security_level < self.security_level:
            # XXX : use min value, is it correct ?
            self.security_level = message.security_level
            self.save()
        index = self._index_class.get(self.user_id,
                                      self.thread_id)
        if not index:
            log.error('Index not found for thread %s' % self.thread_id)
            raise Exception
        index_data = {
            'slug': message.text[:200],
            'date_update': datetime.utcnow(),
            'security_level': self.security_level,
        }
        if message.recipients:
            contacts = [x.to_primitive() for x in message.recipients]
            index_data.update({
                'contacts': contacts,
            })
        if message.tags:
            index_data.update({'tags': message.tags})
        index.update({'doc': index_data})
        log.debug('Update index for thread %s' % self.thread_id)
        return True

    @classmethod
    def by_external_id(cls, user, external_thread_id):
        try:
            lookup = ThreadExternalLookup.get(user, external_thread_id)
        except NotFound:
            return None
        return cls.get(user, lookup.thread_id)

    @classmethod
    def by_recipient_name(cls, user, recipient_name):
        try:
            lookup = ThreadRecipientLookup.get(user, recipient_name)
        except NotFound:
            return None
        return cls.get(user, lookup.thread_id)

    @classmethod
    def expand_contacts(self, user, contacts):
        results = []
        for contact in contacts:
            results.append(Contact.get(user, contact['contact_id']))
        return results

    @classmethod
    def expand_tags(self, user, tags):
        if not tags:
            return []
        user_tags = dict((x.label, x) for x in user.tags)
        results = []
        for tag in tags:
            if tag in user_tags:
                results.append(user_tags[tag])
            else:
                log.warn('Unknow user tag %r' % tag)
        return results


class ReturnIndexThread(ReturnIndexObject):

    _index_class = IndexedThread
    _return_class = ThreadParam
