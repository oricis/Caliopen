# -*- coding: utf-8 -*-
"""Caliopen public key core classes."""
from __future__ import absolute_import, print_function, unicode_literals

from caliopen_main.common.store import PublicKey as ModelPublicKey
from caliopen_main.common.core.related import BaseUserRelatedCore


class PublicKey(BaseUserRelatedCore):
    """Public key core class."""

    _model_class = ModelPublicKey
    _pkey_name = 'key_id'
