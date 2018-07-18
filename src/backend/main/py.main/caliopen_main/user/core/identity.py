# -*- coding: utf-8 -*-
"""Caliopen user related core classes."""

from __future__ import absolute_import, print_function, unicode_literals

from caliopen_storage.core import BaseCore, BaseUserCore
from ..store import (UserIdentity as ModelUserIdentity,
                     IdentityLookup as ModelIdentityLookup,
                     IdentityTypeLookup as ModelIdentityTypeLookup)


class UserIdentity(BaseCore):
    """User's identity core class."""

    _model_class = ModelUserIdentity
    _pkey_name = 'identifier'


class IdentityLookup(BaseUserCore):
    """Lookup table core class."""

    _model_class = ModelIdentityLookup
    _pkey_name = 'identifier'

class IdentityTypeLookup(BaseUserCore):
    """Lookup table core class"""

    _model_class = ModelIdentityTypeLookup
    _pkey_name = 'type'