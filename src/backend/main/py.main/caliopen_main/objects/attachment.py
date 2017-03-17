# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from caliopen_main.user.store import ModelMessageAttachment
from caliopen_main.user.store import IndexedMessageAttachment

class MessageAttachment(base.ObjectStorable):

    """attachment's attributes, nested within message object"""

    _attrs = {
        'content_type': types.StringType,
        'is_inline': types.BooleanType,
        'name': types.StringType,
        'size': types.IntType
    }

    _model_class = ModelMessageAttachment
    _index_class = IndexedMessageAttachment