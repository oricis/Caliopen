# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to device."""

from __future__ import absolute_import, print_function, unicode_literals

import logging
import uuid

import datetime
import pytz

from caliopen_storage.store.model import BaseModel, BaseUserType

from cassandra.cqlengine import columns

log = logging.getLogger(__name__)


class DevicePublicKey(BaseModel):
    """Device related public cryptographic key model."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True)    # clustering key
    key_id = columns.UUID(primary_key=True)       # clustering key

    date_insert = columns.DateTime(default=datetime.datetime.now(tz=pytz.utc))
    date_update = columns.DateTime()
    expire_date = columns.DateTime()

    key = columns.Text()
    fingerprint = columns.Text()

    # JWT parameters
    kty = columns.Text()    # rsa / ec
    use = columns.Text()    # sig / enc
    alg = columns.Text()    # algorithm
    # Elliptic curve public key parameters (rfc7518 6.2.1)
    crv = columns.Text()
    x = columns.Integer()
    y = columns.Integer()


class DeviceLocation(BaseUserType):
    """Device known location, base on IP."""

    address = columns.Text(primary_key=True)    # IP address with CIDR
    type = columns.Text()                       # home/work/etc
    country = columns.Text()
    privacy_features = columns.Map(columns.Text, columns.Text)


class Device(BaseModel):
    """User device."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True, default=uuid.uuid4)

    name = columns.Text()
    date_insert = columns.DateTime(required=True,
                                   default=datetime.datetime.now(tz=pytz.utc))
    type = columns.Text(required=True)      # laptop, desktop, smartphone, etc
    status = columns.Text(default='unknown')
    privacy_features = columns.Map(columns.Text, columns.Text)
    locations = columns.List(columns.UserDefinedType(DeviceLocation))
    user_agent = columns.Text()
    ip_creation = columns.Text()


class DeviceConnectionLog(BaseModel):
    """Log a device connection."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True)
    date_insert = columns.DateTime(primary_key=True,
                                   default=datetime.datetime.now(tz=pytz.utc))
    ip_address = columns.Text(required=True)
    type = columns.Text()       # Connection type (login/logout)
    country = columns.Text()    # Geoip detected country
    privacy_features = columns.Map(columns.Text, columns.Text)
