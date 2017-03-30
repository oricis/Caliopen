# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base

import uuid
from uuid import UUID
import datetime
from caliopen_main.message.store import Message as ModelMessage
from caliopen_main.message.store import IndexedMessage
from caliopen_main.message.parameters.message import (Message as ParamMessage,
                                                      NewMessage)
from caliopen_main.message.core import RawMessage
from .tag import ResourceTag
from .attachment import MessageAttachment
from .external_references import ExternalReferences
from .identities import Identity
from .participant import Participant
from .privacy_features import PrivacyFeatures

import logging

log = logging.getLogger(__name__)


class Message(base.ObjectIndexable):
    # TODO : manage attrs that should not be editable directly by users
    _attrs = {
        'attachments': [MessageAttachment],
        'body': types.StringType,
        'date': datetime.datetime,
        'date_delete': datetime.datetime,
        'date_insert': datetime.datetime,
        'discussion_id': UUID,
        'external_references': ExternalReferences,
        'identities': [Identity],
        'importance_level': types.IntType,
        'is_answered': types.BooleanType,
        'is_draft': types.BooleanType,
        'is_unread': types.BooleanType,
        'message_id': UUID,
        'parent_id': types.StringType,
        'participants': [Participant],
        'privacy_features': PrivacyFeatures,
        'raw_msg_id': UUID,
        'subject': types.StringType,
        'tags': [ResourceTag],
        'type': types.StringType,
        'user_id': UUID,
    }

    _json_model = ParamMessage

    # operations related to cassandra
    _model_class = ModelMessage
    _db = None  # model instance with datas from db
    _pkey_name = "message_id"

    #  operations related to elasticsearch
    _index_class = IndexedMessage
    _index = None

    @property
    def raw(self):
        """Return raw text from pristine raw message."""
        msg = RawMessage.get_for_user(self.user_id, self.raw_msg_id)
        return msg.raw_data

    @property
    def raw_json(self):
        """Return json representation of pristine raw message."""
        msg = RawMessage.get_for_user(self.user_id, self.raw_msg_id)
        return msg.json_rep

    @classmethod
    def create_draft(cls, user_id=None, **params):
        """create and save a new message (draft) for an user
        
        :params: a NewMessage dict
        """
        if user_id is None or user_id is "":
            raise ValueError

        try:
            message_param = NewMessage(params)
            message_param.validate()
        except Exception as exc:
            raise exc
        message = Message()
        message.unmarshall_json_dict(params)
        message.user_id = UUID(user_id)
        message.message_id = uuid.uuid4()
        message.is_draft = True

        message.marshall_db()
        print(vars(message))
        message.save_db()
        return message
