# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

import types
from caliopen_main.objects import base
from uuid import UUID
from caliopen_main.user.store.contact import Organization
from caliopen_main.user.returns.contact import OrganizationParam
from caliopen_main.user.store.contact_index import IndexedOrganization


class Organization(base.ObjectIndexable):

    _attrs = {
        "department":               types.StringType,
        "is_primary":               types.BooleanType,
        "job_description":          types.StringType,
        "label":                    types.StringType,
        "name":                     types.StringType,
        "title":                    types.StringType,
        "type":                     types.StringType,
        "contact_id":               UUID,
        "deleted":                  types.BooleanType,
        "organization_id":          UUID,
        "user_id":                  UUID
    }

    _model_class = Organization
    _json_model = OrganizationParam
    _index_class = IndexedOrganization

    def __init__(self):
        super(base.CaliopenObject, self).__init__()
