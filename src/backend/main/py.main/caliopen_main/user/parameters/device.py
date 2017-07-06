# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.transforms import blacklist
from schematics.types import DateTimeType, StringType, UUIDType
from schematics.types.compound import ListType, ModelType, DictType

from caliopen_pi.parameters import PIParameter

DEVICE_TYPES = ['unknow', 'desktop', 'laptop', 'smartphone', 'tablet']


class DeviceLocation(Model):
    """Location structure for a device."""

    address = StringType(required=True)  # With CIDR notation
    type = StringType()


class DeviceInformation(Model):
    """Device important information when creating a new one."""

    os_version = StringType()
    hardware_info = StringType()
    browser_info = StringType()


class NewDevice(Model):
    """Structure to create a new user device."""

    name = StringType(required=True)
    type = StringType(required=True, choices=DEVICE_TYPES, default='unknow')

    locations = ListType(ModelType(DeviceLocation), default=lambda: [])
    informations = ModelType(DeviceInformation)


class Device(NewDevice):
    """Parameter for an existing device."""

    device_id = UUIDType(required=True)
    user_id = UUIDType(required=True)
    date_insert = DateTimeType(required=True,
                               serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                               tzd=u'utc')
    last_seen = DateTimeType(serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                             tzd=u'utc')
    status = StringType(required=True)

    privacy_features = DictType(StringType, default=lambda: {})
    pi = ModelType(PIParameter)

    class Options:
        serialize_when_none = False
        roles = {'default': blacklist('user_id')}
