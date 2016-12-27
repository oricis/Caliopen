# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from uuid import UUID
from caliopen_main.user.parameters.types import InternetAddressType
from caliopen_main.user.store.contact import Email
from caliopen_main.user.returns.contact import EmailParam
from caliopen_main.user.store.contact_index import IndexedInternetAddress


class Email(ObjectStorable, ObjectIndexable):

    _attrs = {
        "address":              InternetAddressType,
        "contact_id":           UUID,
        "email_id":             UUID,
        "is_primary":           BooleanType,
        "label":                StringType,
        "type":                 StringType,
        "user_id":              UUID
    }

    _json_model = EmailParam
    _model_class = Email
    _index_class = IndexedInternetAddress

    def __init__(self):
        super(CaliopenObject, self).__init__()
