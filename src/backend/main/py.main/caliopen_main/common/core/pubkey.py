# -*- coding: utf-8 -*-
"""Caliopen public key core classes."""
from __future__ import absolute_import, print_function, unicode_literals

import uuid

from caliopen_main.common.store import PublicKey as ModelPublicKey
from caliopen_main.common.core.related import BaseUserRelatedCore


class PublicKey(BaseUserRelatedCore):
    """Public key core class."""

    _model_class = ModelPublicKey
    _pkey_name = 'key_id'

    @classmethod
    def find(cls, user, resource_id):
        """Get public keys for an user and a resource."""
        models = cls._model_class.filter(user_id=user.user_id,
                                         resource_id=resource_id)
        for m in models:
            yield cls(m)

    @classmethod
    def create(cls, user, resource_id, resource_type, **kwargs):
        """Create a new public key related to an user and a resource."""
        key_id = uuid.uuid4()
        obj = cls._model_class.create(user_id=user.user_id,
                                      resource_id=resource_id,
                                      resource_type=resource_type,
                                      key_id=key_id,
                                      **kwargs)
        return cls(obj)
