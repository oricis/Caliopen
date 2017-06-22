# -*- coding: utf-8 -*-
"""Caliopen index classes for nested tag."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

from elasticsearch_dsl import InnerObjectWrapper, Date, Integer, Boolean, \
    Keyword, Text

log = logging.getLogger(__name__)


class IndexedResourceTag(InnerObjectWrapper):
    """Nest tag indexed model."""

    date_insert = Date()
    importance_level = Integer()
    label = Text()
    name = Keyword()
    tag_id = Keyword()
    type = Boolean()
