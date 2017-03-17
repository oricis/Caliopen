# -*- coding: utf-8 -*-
"""Caliopen tag objects."""
from __future__ import absolute_import, print_function, unicode_literals

import uuid
from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType, BaseModel


class UserTag(BaseModel):

    """User tags model."""

    date_insert = columns.DateTime()
    importance_level = columns.Integer()
    label = columns.Text()
    name = columns.Text()
    tag_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    type = columns.Text()
    user_id = columns.UUID(primary_key=True)


class ResourceTag(BaseUserType):

    """Tag nested in resource model."""
    _pkey = 'tag_id'

    importance_level = columns.Integer()
    label = columns.Text()
    name = columns.Text()
    tag_id = columns.UUID()
    type = columns.Text()
