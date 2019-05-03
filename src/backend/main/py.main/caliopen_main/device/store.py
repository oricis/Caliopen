# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to device."""

from __future__ import absolute_import, print_function, unicode_literals

import logging
import uuid

from datetime import datetime

from cassandra.cqlengine import columns

from caliopen_storage.store.model import BaseModel
from caliopen_main.pi.objects import PIModel


log = logging.getLogger(__name__)


class DeviceLocation(BaseModel):
    """Device defined location, based on IP address."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True)
    address = columns.Text(primary_key=True)    # IP address with CIDR
    type = columns.Text()                       # home/work/etc
    country = columns.Text()


class Device(BaseModel):
    """User device."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True, default=uuid.uuid4)

    name = columns.Text()
    date_insert = columns.DateTime(required=True, default=datetime.utcnow)
    date_revoked = columns.DateTime()
    type = columns.Text(required=True)      # laptop, desktop, smartphone, etc
    status = columns.Text(default='unverified')
    user_agent = columns.Text()
    ip_creation = columns.Text()
    privacy_features = columns.Map(columns.Text, columns.Text)
    pi = columns.UserDefinedType(PIModel)


class DeviceConnectionLog(BaseModel):
    """Log a device connection."""

    user_id = columns.UUID(primary_key=True)
    resource_id = columns.UUID(primary_key=True)  # device_id
    date_insert = columns.DateTime(primary_key=True, default=datetime.utcnow)
    ip_address = columns.Text()
    type = columns.Text()       # Connection type (login/logout)
    country = columns.Text()    # Geoip detected country
