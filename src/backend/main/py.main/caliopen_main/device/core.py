# -*- coding: utf-8 -*-
"""Caliopen device core classes."""
from __future__ import absolute_import, print_function, unicode_literals
import logging
import uuid

from .store import Device as ModelDevice
from .store import DeviceLocation as ModelDeviceLocation

from caliopen_storage.core import BaseUserCore
from caliopen_storage.core.mixin import MixinCoreRelation, MixinCoreNested
from caliopen_main.common.core import PublicKey, BaseUserRelatedCore
from caliopen_main.common.parameters import NewPublicKey
from caliopen_main.device.parameters import NewDevice
from caliopen_pi.qualifiers import NewDeviceQualifier


log = logging.getLogger(__name__)


class DeviceLocation(BaseUserRelatedCore):
    """Locations defined for a device to restrict access."""

    _model_class = ModelDeviceLocation
    _pkey_name = 'address'


class Device(BaseUserCore, MixinCoreRelation, MixinCoreNested):
    """User device core class."""

    _model_class = ModelDevice
    _pkey_name = 'device_id'

    _relations = {
        'public_keys': PublicKey,
        'locations': ModelDeviceLocation,
    }

    @classmethod
    def create_default(cls, user, param, headers):
        """Create the default device on signup."""
        dev = NewDevice()
        dev.name = 'default'
        dev.device_id = param['device_id']
        dev.user_agent = headers.get('User-Agent')
        dev.ip_creation = headers.get('X-Forwarded-For')
        qualifier = NewDeviceQualifier(user)
        qualifier.process(dev)
        dev.type = dev.privacy_features.get('device_type', 'other')
        # Device ecdsa key
        dev_key = NewPublicKey()
        dev_key.key_id = uuid.uuid4()
        dev_key.resource_id = dev.device_id
        dev_key.resource_type = 'device'
        dev_key.label = 'ecdsa key'
        dev_key.kty = 'ec'
        dev_key.use = 'sig'
        dev_key.x = int(param['ecdsa_key']['x'], 16)
        dev_key.y = int(param['ecdsa_key']['y'], 16)
        dev_key.crv = param['ecdsa_key']['curve']
        # XXX Should be better design
        alg_map = {
            'P-256': 'ES256',
            'P-384': 'ES384',
            'P-521': 'ES512'
        }
        dev_key.alg = alg_map[dev_key.crv]
        return Device.create(user, dev, public_keys=[dev_key])

    @classmethod
    def create(cls, user, device, **related):
        """Create a new device for an user."""
        device.validate()
        attrs = {'device_id': device.device_id,
                 'type': device.type,
                 'name': device.name,
                 'user_agent': device.user_agent,
                 'ip_creation': device.ip_creation,
                 'privacy_features': device.privacy_features}

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
