# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from caliopen_main.user.store import LocalIdentity
from caliopen_main.user.store import IndexedLocalIdentity

class LocalIdentity(base.ObjectIndexable):

    """Local identity related to an user."""

    _attrs = {
        'display_name': types.StringType,
        'identifier': types.StringType,
        'status': types.StringType,
        'type': types.StringType,
    }

    _model_class = LocalIdentity
    _pkey_name = 'identifier'
    _db = None  # model instance with datas from db

    _index_class = IndexedLocalIdentity
    _index = None
