# -*- coding: utf-8 -*-
"""Caliopen tag objects."""
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseModel


class UserTag(BaseModel):
    """User tags model."""
    user_id = columns.UUID(primary_key=True)
    name = columns.Text(primary_key=True)
    date_insert = columns.DateTime()
    importance_level = columns.Integer()
    label = columns.Text()
    type = columns.Text()
