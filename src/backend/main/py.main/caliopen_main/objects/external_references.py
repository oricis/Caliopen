# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from caliopen_main.user.store import ModelExternalReferences
from caliopen_main.user.store import IndexedExternalReferences

class ExternalReferences(base.ObjectStorable):

    """attachment's attributes, nested within message object"""

    _attrs = {
        'discussion_id': types.StringType,
        'message_id': types.StringType,
        'parent_id': types.StringType
    }

    _model_class = ModelExternalReferences
    _index_class = IndexedExternalReferences