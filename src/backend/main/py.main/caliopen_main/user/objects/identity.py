# -*- coding: utf-8 -*-
"""Caliopen message object classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
import datetime
from uuid import UUID

from caliopen_main.common.objects.base import ObjectUser

from ..store.identity import UserIdentity as ModelUserIdentity


class Credentials():
    _attrs = {}


class UserIdentity(ObjectUser):
    """Local or remote identity related to an user."""

    _attrs = {
        'credentials': Credentials,
        'display_name': types.StringType,
        'identifier': types.StringType,  # for example: me@caliopen.org
        'identity_id': UUID,
        'infos': types.DictionaryType,
        'last_check': datetime.datetime,
        'protocol': types.StringType,  # for example: smtp, imap, mastodon
        'status': types.StringType,  # for example : active, inactive, deleted
        'type': types.StringType,  # for example : local, remote
        'user_id': UUID
    }

    _model_class = ModelUserIdentity
    _pkey_name = 'identity_id'
    _db = None  # model instance with data from db
