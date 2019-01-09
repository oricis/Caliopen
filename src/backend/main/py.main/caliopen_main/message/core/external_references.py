# -*- coding: utf-8 -*-
"""Caliopen core message external references lookup class."""
from __future__ import absolute_import, print_function, unicode_literals

from caliopen_main.common.core import BaseUserCore
from ..store import MessageExternalRefLookup as ModelMessageExternalRefLookup


class MessageExternalRefLookup(BaseUserCore):
    """Lookup message by external message-id"""

    _model_class = ModelMessageExternalRefLookup
    _pkey_name = 'external_msg_id'