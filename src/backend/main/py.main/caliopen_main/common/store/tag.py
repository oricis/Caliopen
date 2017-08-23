# -*- coding: utf-8 -*-
"""Caliopen tag objects."""
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns
from elasticsearch_dsl import InnerObjectWrapper, Date, Integer
from elasticsearch_dsl import Boolean, Keyword, Text

from caliopen_storage.store import BaseUserType


class ResourceTag(BaseUserType):
    """Tag nested in resource model."""

    _pkey = 'tag_id'

    importance_level = columns.Integer()
    label = columns.Text()
    name = columns.Text()
    tag_id = columns.UUID()
    type = columns.Text()


class IndexedResourceTag(InnerObjectWrapper):
    """Nested tag into indexed resource model."""

    date_insert = Date()
    importance_level = Integer()
    label = Text()
    name = Keyword()
    tag_id = Keyword()
    type = Boolean()
