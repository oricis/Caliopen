# -*- coding: utf-8 -*-
"""Caliopen device core classes."""
from __future__ import absolute_import, print_function, unicode_literals

from caliopen_storage.core import BaseCore
from caliopen_main.common.core import BaseUserCore

from .store import Notification as ModelNotification, \
    NotificationTtl as ModelTTLs


class Notification(BaseUserCore):
    """User Notification core class"""

    _model_class = ModelNotification
    _pkey_name = "user_id"


class NotificationTtl(BaseCore):
    """core class to store default TTLs for each notification kind"""

    _model_class = ModelTTLs
    _pkey_name = "notif_code"
