# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from uuid import UUID
from caliopen_main.user.store.contact import SocialIdentity
from caliopen_main.user.returns.contact import SocialIdentityParam
from caliopen_main.user.store.contact_index import IndexedSocialIdentity


class SocialIdentity(ObjectIndexable):

    _attrs = {
        "contact_id":       UUID,
        "identity_id":      UUID,
        "infos":            {},
        "name":             StringType,
        "type":             StringType,
        "user_id":          UUID
    }

    _json_model = SocialIdentityParam
    _model_class = SocialIdentity
    _index_class = IndexedSocialIdentity

    def __init__(self):
        super(CaliopenObject, self).__init__()
