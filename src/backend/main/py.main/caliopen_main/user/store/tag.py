# -*- coding: utf-8 -*-
"""Caliopen tag objects."""
from __future__ import absolute_import, print_function, unicode_literals

import uuid
from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType, BaseModel


class UserTag(BaseModel):

    """User tags model."""

    user_id = columns.UUID(primary_key=True)
    tag_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    name = columns.Text()
    type = columns.Text()
    date_insert = columns.DateTime()


class ResourceTag(BaseUserType):

    """Tag nested in resource model."""
    _pkey = 'tag_id'

    tag_id = columns.UUID()
    name = columns.Text()
    type = columns.Text()
