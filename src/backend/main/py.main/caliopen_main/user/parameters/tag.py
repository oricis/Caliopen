# -*- coding: utf-8 -*-
"""Caliopen tags parameters."""

from schematics.models import Model
from schematics.types import StringType, UUIDType, DateTimeType
from schematics.transforms import blacklist


class NewUserTag(Model):
    """Create a new user tag."""

    user_id = UUIDType()
    name = StringType()

    class Option:
        roles = {'default': blacklist('user_id')}
        serialize_when_none = False


class UserTag(NewUserTag):
    """Existing user tag."""

    type = StringType()
    date_format = "%Y-%m-%dT%H:%M:%S.%f+00:00"
    date_insert = DateTimeType(serialized_format=date_format, tzd=u'utc')
