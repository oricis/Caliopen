# -*- coding: utf-8 -*-
"""Caliopen device parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.transforms import blacklist
from schematics.types import DateTimeType, StringType, UUIDType
from schematics.types.compound import ListType, ModelType, DictType

from caliopen_main.pi.parameters import PIParameter
import caliopen_storage.helpers.json as helpers

DEVICE_TYPES = ['other', 'desktop', 'laptop', 'smartphone', 'tablet']


class DeviceLocation(Model):
    """Location structure for a device."""

    user_id = UUIDType()
    device_id = UUIDType()
    address = StringType(required=True)  # With CIDR notation
    type = StringType()
    country = StringType()

    class Options:
        serialize_when_none = False
        roles = {'default': blacklist('user_id', 'device_id')}


class NewDevice(Model):
    """Structure to create a new user device."""

    name = StringType(required=True)
    type = StringType(required=True, choices=DEVICE_TYPES, default='other')

    locations = ListType(ModelType(DeviceLocation), default=lambda: [])
    user_agent = StringType()
    ip_creation = StringType()


class Device(NewDevice):
    """Parameter for an existing device."""

    device_id = UUIDType()
    user_id = UUIDType()
    date_insert = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    date_revoked = DateTimeType(serialized_format=helpers.RFC3339Milli,
                                tzd=u'utc')
    status = StringType()

    privacy_features = DictType(StringType, default=lambda: {})
    pi = ModelType(PIParameter)

    class Options:
        serialize_when_none = False
        roles = {'default': blacklist('user_id')}
