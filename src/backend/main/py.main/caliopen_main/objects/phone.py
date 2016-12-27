# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from caliopen_main.user.parameters.types import PhoneNumberType
from uuid import UUID
from caliopen_main.user.store.contact import Phone
from caliopen_main.user.returns.contact import PhoneParam
from caliopen_main.user.store.contact_index import IndexedPhone


class Phone(ObjectStorable, ObjectIndexable):

    _attrs = {
        "contact_id":               UUID,
        "is_primary":               BooleanType,
        "number":                   PhoneNumberType,
        "phone_id":                 UUID,
        "type":                     StringType,
        "uri":                      StringType,
        "user_id":                  UUID
    }

    _model_class = Phone
    _json_model = PhoneParam
    _index_class = IndexedPhone

    def __init__(self):
        super(CaliopenObject, self).__init__()
