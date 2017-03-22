# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base


class ExternalReferences(base.ObjectJsonDictifiable):
    """attachment's attributes, nested within message object"""

    _attrs = {
        'discussion_id': types.StringType,
        'message_id': types.StringType,
        'parent_id': types.StringType
    }
