# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base

from uuid import UUID
import datetime
from caliopen_main.message.store import Message as ModelMessage
from caliopen_main.message.store import IndexedMessage
from caliopen_main.message.parameters import Message as ParamMessage
from .tag import ResourceTag


import logging
log = logging.getLogger(__name__)


class Message(base.ObjectIndexable):

    # TODO : manage attrs that should not be modifiable directly by users
    _attrs = {
        'user_id': UUID,
        'message_id': UUID,
        # 'discussion_id': UUID,
        'type': types.StringType,
        'from_': types.StringType,
        'date': datetime.datetime,
        'size': types.IntType,
        'subject': types.StringType,
        'tags': [ResourceTag],
    }

    _json_model = ParamMessage

    # operations related to cassandra
    _model_class = ModelMessage
    _db = None  # model instance with datas from db
    _pkey_name = "message_id"

    #  operations related to elasticsearch
    _index_class = IndexedMessage
    _index = None
