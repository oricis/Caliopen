# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from uuid import UUID
from caliopen_main.user.parameters.types import InternetAddressType
from caliopen_main.user.store.contact import Email
from caliopen_main.user.returns.contact import EmailParam
from caliopen_main.user.store.contact_index import IndexedInternetAddress


class Email(base.ObjectIndexable):

    _attrs = {
        "address":              InternetAddressType,
        "contact_id":           UUID,
        "email_id":             UUID,
        "is_primary":           types.BooleanType,
        "label":                types.StringType,
        "type":                 types.StringType,
        "user_id":              UUID
    }

    _json_model = EmailParam
    _model_class = Email
    _index_class = IndexedInternetAddress

    def __init__(self):
        super(base.CaliopenObject, self).__init__()
