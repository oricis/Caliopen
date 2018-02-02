# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import StringType, UUIDType, DateTimeType
from schematics.transforms import blacklist

import caliopen_storage.helpers.json as helpers

KEY_CHOICES = ['rsa', 'gpg', 'ssh']


class NewPublicKey(Model):
    """Input structure for a new public key."""

    expire_date = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    fingerprint = StringType()
    key = StringType(required=True)
    label = StringType(required=True)
    type = StringType(choices=KEY_CHOICES)

    class Options:
        serialize_when_none = False


class PublicKey(NewPublicKey):
    """Existing public key."""

    resource_type = StringType()
    resource_id = UUIDType()
    date_insert = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    date_update = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    user_id = UUIDType()

    class Options:
        roles = {'default': blacklist('user_id', 'contact_id')}
        serialize_when_none = False
