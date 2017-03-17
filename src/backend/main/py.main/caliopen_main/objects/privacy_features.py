# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from caliopen_main.user.store import ModelPrivacyFeatures
from caliopen_main.user.store import IndexedPrivacyFeatures

class PrivacyFeatures(base.ObjectStorable):

    """privacy features nested within message object"""

    _attrs = {

    }

    _model_class = ModelPrivacyFeatures
    _index_class = IndexedPrivacyFeatures