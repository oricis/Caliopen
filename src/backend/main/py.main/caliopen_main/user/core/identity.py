# -*- coding: utf-8 -*-
"""Caliopen user related core classes."""

from __future__ import absolute_import, print_function, unicode_literals

from caliopen_storage.core import BaseCore, BaseUserCore
from ..store import (UserIdentity as ModelUserIdentity,
                     IdentityLookup as ModelIdentityLookup,
                     IdentityTypeLookup as ModelIdentityTypeLookup)


class UserIdentity(BaseUserCore):
    """User's identity core class."""

    _model_class = ModelUserIdentity
    _pkey_name = 'identity_id'

    @classmethod
    def get_by_identifier(cls, identifier, protocol, user_id):
        """return an array of one or more user_identities"""
        if not protocol:
            ids = IdentityLookup.find(identifier=identifier)
        elif not user_id:
            ids = IdentityLookup.find(identifier=identifier,
                                      protocol=protocol)
        else:
            ids = IdentityLookup.find(identifier=identifier,
                                      protocol=protocol,
                                      user_id=user_id)
        identities = []
        for id in ids:
            identities.append(
                UserIdentity.get_by_user_id(id.user_id, id.identity_id))
        return identities


class IdentityLookup(BaseCore):
    """Lookup table core class."""

    _model_class = ModelIdentityLookup
    _pkey_name = 'identifier'


class IdentityTypeLookup(BaseCore):
    """Lookup table core class"""

    _model_class = ModelIdentityTypeLookup
    _pkey_name = 'type'
