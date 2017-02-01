# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import (StringType,
                              UUIDType, DateTimeType, BooleanType)
from schematics.types.compound import ListType, ModelType


DEVICE_TYPES = ['unknow', 'desktop', 'laptop', 'smartphone', 'tablet']
LOCATION_TYPES = ['public', 'work', 'home', 'other']


class DeviceLocation(Model):

    """Location structure for a device."""

    name = StringType(required=True)
    ip_address = StringType(required=True)  # With CIDR notation
    location_type = StringType(required=True, choices=LOCATION_TYPES,
                               default='other')


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
