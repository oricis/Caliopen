# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types

from uuid import UUID
from caliopen_main.objects import base
from caliopen_main.user.store import ModelParticipant
from caliopen_main.user.store import IndexedParticipant

class Participant(base.ObjectStorable):

    """attachment's attributes, nested within message object"""

    _attrs = {
        'address': types.StringType,
        'contact_id': UUID,
        'label': types.StringType,
        'protocol': types.StringType,
        'type': types.StringType
    }

    _model_class = ModelParticipant
    _index_class = IndexedParticipant