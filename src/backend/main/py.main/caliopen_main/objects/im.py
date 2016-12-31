# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from uuid import UUID
from caliopen_main.user.parameters.types import InternetAddressType
from caliopen_main.user.store.contact import IM
from caliopen_main.user.returns.contact import IMParam
from caliopen_main.user.store.contact_index import IndexedInternetAddress


class IM(ObjectIndexable):

    _attrs = {
        "address":              InternetAddressType,
        "is_primary":           BooleanType,
        "label":                StringType,
        "protocol":             StringType,
        "type":                 StringType,
        "contact_id":           UUID,
        "im_id":                UUID,
        "user_id":              UUID
    }

    _model_class = IM
    _json_model = IMParam
    _index_class = IndexedInternetAddress

    def __init__(self):
        super(CaliopenObject, self).__init__()
