# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.transforms import blacklist
from schematics.types import DateTimeType, StringType, UUIDType, IntegerType
from schematics.types.compound import ListType, ModelType, DictType

from caliopen_main.pi.parameters import PIParameter
import caliopen_storage.helpers.json as helpers

DEVICE_TYPES = ['unknow', 'desktop', 'laptop', 'smartphone', 'tablet']


class DeviceLocation(Model):
    """Location structure for a device."""

    address = StringType(required=True)  # With CIDR notation
    type = StringType()


class EcdsaPubKey(Model):
    """Device Elliptic Curve signature key."""

    x = IntegerType(required=True)
    y = IntegerType(required=True)
    curve = StringType(required=True)
    hash = StringType()


class NewDevice(Model):
    """Structure to create a new user device."""

    name = StringType(required=True)
    type = StringType(required=True, choices=DEVICE_TYPES, default='unknow')

    locations = ListType(ModelType(DeviceLocation), default=lambda: [])
    user_agent = StringType()
    ip_address = StringType()
    ecdsa_key = ModelType(EcdsaPubKey(), default=lambda: None)


class Device(NewDevice):
    """Parameter for an existing device."""

    device_id = UUIDType()
    user_id = UUIDType()
    date_insert = DateTimeType(serialized_format=helpers.RFC3339Milli,
                               tzd=u'utc')
    status = StringType()

    privacy_features = DictType(StringType, default=lambda: {})
    pi = ModelType(PIParameter)

    class Options:
        serialize_when_none = False
        roles = {'default': blacklist('user_id')}
