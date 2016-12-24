# -*- coding: utf-8 -*-
"""Caliopen device core classes."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

from ..store import (Device as ModelDevice,
                     DevicePublicKey as ModelDevicePublicKey,
                     DeviceLocation as ModelDeviceLocation,
                     DeviceConnectionLog as ModelDeviceConnectionLog)

from caliopen_storage.core import BaseUserCore
from caliopen_storage.core.mixin import MixinCoreRelation


log = logging.getLogger(__name__)


class DevicePublicKey(BaseUserCore):

    """Public cryptographic key belong to a device."""

    _model_class = ModelDevicePublicKey


class DeviceLocation(BaseUserCore):

    """Declared device known location core."""

    # XXX it a sub resource object related to device as relation.
    # we need to consider base method from BaseUserCore as not working
    # abstract of ContactSubCore to get XXXSubCore logic, using a second id
    _model_class = ModelDeviceLocation


class Device(BaseUserCore, MixinCoreRelation):

    """User device core class."""

    _model_class = ModelDevice
    _pkey_name = 'device_id'

    _relations = {
        'locations': DeviceLocation,
        'keys': DevicePublicKey,
    }
