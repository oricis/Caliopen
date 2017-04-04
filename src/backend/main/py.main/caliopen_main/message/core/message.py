# -*- coding: utf-8 -*-
"""Caliopen core user's messages."""

#from __future__ import absolute_import, print_function, unicode_literals
#import logging
#import uuid
#
#from datetime import datetime
#
#
#from caliopen_storage.core import BaseUserCore
#from caliopen_storage.core.mixin import MixinCoreNested
#from caliopen_storage.parameters import ReturnCoreObject
#
#from caliopen_main.user.store import ResourceTag
#
#from ..store import (Message as ModelMessage,
#                     ModelParticipant, RawMessage)
#from ..parameters import Message as ParamMessage
#
#
#log = logging.getLogger(__name__)
#
#
#class Message(BaseUserCore, MixinCoreNested):
#
#    """Message core object."""
#
#    _model_class = ModelMessage
#    _pkey_name = 'message_id'
#
#    _nested = {
#        'emails': ResourceTag,
#        'recipients': ModelParticipant,
#    }
#
#    @classmethod
#    def create(cls, user, message, thread_id=None, lookup=None):
#        """Create a new message for a given user, store it in db, and index it"""
#        message.validate()
#
#        parent_id = message.external_parent_id
#        answer_to = lookup.message_id if lookup else None
#
#        # TODO : index parts information
#        extras = {'headers': message.headers,
#                  'text': message.text,
#                  'answer_to': answer_to}
#        attrs = {'thread_id': thread_id,
#                 'type': message.type,
#                 'state': message.state,
#                 'from_': message.from_,
#                 'date': message.date,
#                 'date_insert': datetime.utcnow(),
#                 'size': message.size,
#                 'privacy_index': message.privacy_index,
#                 'importance_level': message.importance_level,
#                 'subject': message.subject,
#                 'external_message_id': message.external_message_id,
#                 'external_parent_id': parent_id,
#                 'raw_msg_id': message.raw_msg_id,
#                 'tags': cls.create_nested(message.tags, ResourceTag),
#                 'flags': ['Recent'],
#                 'lookup': lookup,
#                 'recipients': cls.create_nested(message.recipients, ModelParticipant),
#                 'text': message.text,
#                 '_indexed_extra': extras}
#        return super(Message, cls).create(user, **attrs)
#
#    @classmethod
#    def by_discussion_id(cls, user, discussion_id, min_pi, max_pi,
#                     order=None, limit=None, offset=0):
#        """Get messages for a given discussion from index."""
#        res = cls._model_class.search(user, thread_id=discussion_id,
#                                      min_pi=min_pi, max_pi=max_pi,
#                                      limit=limit,
#                                      offset=offset)
#        log.debug('search  result{}'.format(res))
#        messages = []
#        if res.hits:
#            messages = [cls.get(user, x.meta.id) for x in res.hits]
#        return {'hits': messages, 'total': res.hits.total}
#
#    @property
#    def raw(self):
#        """Return raw text from message."""
#        # XXX do not use RawMessage lookup
#        raw = RawMessage.get(self.user, self.raw_msg_id)
#        msg = raw.parse()
#        return msg.text
#
#
#class ReturnMessage(ReturnCoreObject):
#
#    """Return parameter from a core message."""
#
#    _core_class = Message
#   _return_class = ParamMessage
