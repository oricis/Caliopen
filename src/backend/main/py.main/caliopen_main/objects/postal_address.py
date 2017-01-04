# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from uuid import UUID
from caliopen_main.user.store.contact import PostalAddress
from caliopen_main.user.returns.contact import PostalAddressParam
from caliopen_main.user.store.contact_index import IndexedPostalAddress


class PostalAddress(base.ObjectIndexable):

    _attrs = {
        "address_id":               UUID,
        "city":                     types.StringType,
        "contact_id":               UUID,
        "country":                  types.StringType,
        "is_primary":               types.BooleanType,
        "label":                    types.StringType,
        "postal_code":              types.StringType,
        "region":                   types.StringType,
        "street":                   types.StringType,
        "type":                     types.StringType,
        "user_id":                  UUID
    }

    _model_class = PostalAddress
    _json_model = PostalAddressParam
    _index_class = IndexedPostalAddress

    def __init__(self):
        super(base.CaliopenObject, self).__init__()
