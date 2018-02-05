# -*- coding: utf-8 -*-
"""Caliopen device core classes."""
from __future__ import absolute_import, print_function, unicode_literals

import uuid
import logging

from ..store import Device as ModelDevice
from ..store import DeviceLocation as ModelDeviceLocation

from caliopen_storage.core import BaseUserCore
from caliopen_storage.core.mixin import MixinCoreNested


log = logging.getLogger(__name__)


class Device(BaseUserCore, MixinCoreNested):
    """User device core class."""

    _model_class = ModelDevice
    _pkey_name = 'device_id'

    _nested = {
        'locations': ModelDeviceLocation,
    }

    @classmethod
    def create(cls, user, device, **related):
        """Create a new device for an user."""
        device.validate()
        device_id = uuid.uuid4()
        locations = cls.create_nested(device.locations, ModelDeviceLocation)
        attrs = {'device_id': device_id,
                 'type': device.type,
                 'name': device.name,
                 'locations': locations}

        core = super(Device, cls).create(user, **attrs)
        log.debug('Created device %s' % core.device_id)
        return core
