# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from caliopen_main.message.store.attachment import \
    MessageAttachment as ModelMessageAttachment
from caliopen_main.message.store.attachment_index import \
    IndexedMessageAttachment


class MessageAttachment(base.ObjectJsonDictifiable):

    """attachment's attributes, nested within message object"""

    _attrs = {
        'content_type': types.StringType,
        'file_name': types.SliceType,
        'is_inline': types.BooleanType,
        'size': types.IntType,
        'uri': types.StringType
    # objectsStore uri for temporary file (draft) or boundary reference for mime-part attachment
    }

    _model_class = ModelMessageAttachment
    _index_class = IndexedMessageAttachment
