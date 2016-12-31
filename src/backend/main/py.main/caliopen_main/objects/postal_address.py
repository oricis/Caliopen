# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from uuid import UUID
from caliopen_main.user.store.contact import PostalAddress
from caliopen_main.user.returns.contact import PostalAddressParam
from caliopen_main.user.store.contact_index import IndexedPostalAddress


class PostalAddress(ObjectIndexable):

    _attrs = {
        "address_id":               UUID,
        "city":                     StringType,
        "contact_id":               UUID,
        "country":                  StringType,
        "is_primary":               BooleanType,
        "label":                    StringType,
        "postal_code":              StringType,
        "region":                   StringType,
        "street":                   StringType,
        "type":                     StringType,
        "user_id":                  UUID
    }

    _model_class = PostalAddress
    _json_model = PostalAddressParam
    _index_class = IndexedPostalAddress

    def __init__(self):
        super(CaliopenObject, self).__init__()
