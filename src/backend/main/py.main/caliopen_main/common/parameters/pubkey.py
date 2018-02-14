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

    resource_id = UUIDType(required=True)
    resource_type = StringType(required=True)
    key_id = UUIDType()

    expire_date = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    label = StringType(required=True)
    fingerprint = StringType()
    key = StringType()
    type = StringType()

    # JWT parameters
    kty = StringType()    # rsa / ec
    use = StringType()    # sig / enc
    alg = StringType()    # algorithm
    # Elliptic curve public key parameters (rfc7518 6.2.1)
    crv = StringType()
    x = StringType()
    y = StringType()

    class Options:
        serialize_when_none = False


class PublicKey(NewPublicKey):
    """Existing public key."""

    key_id = UUIDType(required=True)
    date_insert = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    date_update = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    user_id = UUIDType()

    class Options:
        roles = {'default': blacklist('user_id', 'device_id')}
        serialize_when_none = False
