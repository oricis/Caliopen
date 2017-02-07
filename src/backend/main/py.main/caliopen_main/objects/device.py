# -*- coding: utf-8 -*-
"""Caliopen User tag parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

import datetime
import logging
import types
import uuid

from caliopen_main.objects import base
from caliopen_main.user.parameters.device import Device as DeviceParam

from caliopen_main.user.store import Device as ModelDevice

log = logging.getLogger(__name__)


class Device(base.ObjectUser):

    """Device related to an user."""

    _attrs = {
        'user_id': uuid.UUID,
        'device_id': uuid.UUID,
        'name': types.StringType,
        'type': types.StringType,
        'status': types.StringType,
        'last_seen': datetime.datetime,
        'date_insert': datetime.datetime}

    _model_class = ModelDevice
    _pkey_name = 'device_id'
    _json_model = DeviceParam

    def delete_db(self):
        """Delete a device in store."""
        self._db.delete()
        return True
