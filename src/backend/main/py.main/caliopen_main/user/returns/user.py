# -*- coding: utf-8 -*-
"""User return object structure."""

from __future__ import absolute_import, print_function, unicode_literals

from caliopen_storage.parameters import ReturnCoreObject
from ..core import User, UserIdentity
from ..parameters import User as UserParam
from ..parameters import UserIdentity as UserIdentityParam


class ReturnUser(ReturnCoreObject):
    """Return object for ``User`` core."""

    _core_class = User
    _return_class = UserParam


class ReturnUserIdentity(ReturnCoreObject):
    """Return object for ``UserIdentity`` core."""

    _core_class = UserIdentity
    _return_class = UserIdentityParam
