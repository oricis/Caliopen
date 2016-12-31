# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from .base import *
from uuid import UUID
from caliopen_main.user.store.contact import Organization
from caliopen_main.user.returns.contact import OrganizationParam
from caliopen_main.user.store.contact_index import IndexedOrganization


class Organization(ObjectIndexable):

    _attrs = {
        "department":               StringType,
        "is_primary":               BooleanType,
        "job_description":          StringType,
        "label":                    StringType,
        "name":                     StringType,
        "title":                    StringType,
        "type":                     StringType,
        "contact_id":               UUID,
        "deleted":                  BooleanType,
        "organization_id":          UUID,
        "user_id":                  UUID
    }

    _model_class = Organization
    _json_model = OrganizationParam
    _index_class = IndexedOrganization

    def __init__(self):
        super(CaliopenObject, self).__init__()
