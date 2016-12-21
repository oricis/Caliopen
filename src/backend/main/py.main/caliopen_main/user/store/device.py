# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to device."""

from __future__ import absolute_import, print_function, unicode_literals

import logging
import uuid

from datetime import datetime

from cassandra.cqlengine import columns
from caliopen_storage.store.model import BaseModel

log = logging.getLogger(__name__)


class Device(BaseModel):

    """User device."""
    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    name = columns.Text()
    date_insert = columns.DateTime(required=True, default=datetime.utcnow)
    type = columns.Text(required=True)
    public_key = columns.Text()
    status = columns.Text()
    privacy_features = columns.Map(columns.Text, columns.Text)


class DeviceLocation(BaseModel):

    """Device known location, base on IP."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True)
    location_ip = columns.Text(primary_key=True)    # IP address with CIDR
    country = columns.Text()
    last_connection = columns.DateTime()
    privacy_features = columns.Map(columns.Text, columns.Text)


class DeviceConnectionLog(BaseModel):

    """Log a device connection."""

    user_id = columns.UUID(primary_key=True)
    device_id = columns.UUID(primary_key=True)
    date_insert = columns.DateTime(primary_key=True, default=datetime.utcnow)
    ip_address = columns.Text(required=True)
    type = columns.Text()       # Connection type (login/logout)
    country = columns.Text()    # Geoip detected country
    privacy_features = columns.Map(columns.Text, columns.Text)
