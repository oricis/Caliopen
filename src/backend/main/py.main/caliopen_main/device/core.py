# -*- coding: utf-8 -*-
"""Caliopen device core classes."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from .store import Device as ModelDevice
from .store import DeviceLocation as ModelDeviceLocation

from caliopen_storage.core import BaseUserCore
from caliopen_storage.core.mixin import MixinCoreRelation, MixinCoreNested
from caliopen_main.common.core import PublicKey


log = logging.getLogger(__name__)


class Device(BaseUserCore, MixinCoreRelation, MixinCoreNested):
    """User device core class."""

    _model_class = ModelDevice
    _pkey_name = 'device_id'

    _nested = {
        'locations': ModelDeviceLocation,
    }

    _relations = {
        'public_keys': PublicKey
    }

    @classmethod
    def create(cls, user, device, **related):
        """Create a new device for an user."""
        device.validate()
        locations = cls.create_nested(device.locations, ModelDeviceLocation)
        attrs = {'device_id': device.device_id,
                 'type': device.type,
                 'name': device.name,
                 'locations': locations}

        core = super(Device, cls).create(user, **attrs)
        log.debug('Created device %s' % core.device_id)
        related_cores = {}
        for k, v in related.iteritems():
            if k in cls._relations:
                for obj in v:
                    log.debug('Processing object %r' % obj.to_native())
                    # XXX check only one is_primary per relation using it
                    new_core = cls._relations[k].create(user,
                                                        **obj)
                    related_cores.setdefault(k, []).append(new_core.to_dict())
                    log.debug('Created related core %r' % new_core)
        return core
