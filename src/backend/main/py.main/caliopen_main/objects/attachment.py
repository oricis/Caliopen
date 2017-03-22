# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base

class MessageAttachment(base.ObjectJsonDictifiable):

    """attachment's attributes, nested within message object"""

    _attrs = {
        'content_type': types.StringType,
        'is_inline': types.BooleanType,
        'name': types.StringType,
        'size': types.IntType
    }
