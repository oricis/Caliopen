# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from .user import NewUser, User, NewRule

from caliopen_main.common.parameters.types import InternetAddressType, PhoneNumberType

from .tag import NewUserTag, UserTag
from .identity import NewUserIdentity, UserIdentity
from .settings import Settings

__all__ = [
    'InternetAddressType', 'PhoneNumberType',
    'NewUser', 'User', 'NewRule',
    'NewUserTag', 'UserTag',
    'NewUserIdentity', 'UserIdentity',
    'Settings',
]
