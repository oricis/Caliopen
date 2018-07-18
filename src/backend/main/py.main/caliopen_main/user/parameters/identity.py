# -*- coding: utf-8 -*-
"""Caliopen user parameters."""

from schematics.models import Model
from schematics.types import StringType, UUIDType, DateTimeType
from schematics.types.compound import DictType

import caliopen_storage.helpers.json as helpers

USER_IDENTITY_PROTOCOLS = ['smtp', 'imap']
USER_IDENTITY_STATUS = ['active', 'inactive', 'deleted']
USER_IDENTITY_TYPES = ['local', 'remote']


class NewUserIdentity(Model):
    credentials = DictType(StringType, default=lambda: {})
    display_name = StringType()
    identifier = StringType(required=True)
    infos = DictType(StringType, default=lambda: {})
    protocol = StringType(choices=USER_IDENTITY_PROTOCOLS)
    status = StringType(default='active', choices=USER_IDENTITY_STATUS)
    type = StringType(choices=USER_IDENTITY_TYPES)


class UserIdentity(NewUserIdentity):
    user_id = UUIDType()
    identity_id = UUIDType()
    last_check = DateTimeType(serialized_format=helpers.RFC3339Milli,
                              tzd=u'utc')

