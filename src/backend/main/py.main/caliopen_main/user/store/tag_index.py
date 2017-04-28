# -*- coding: utf-8 -*-
"""Caliopen index classes for nested tag."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl

log = logging.getLogger(__name__)


class IndexedResourceTag(dsl.InnerObjectWrapper):

    """Nest tag indexed model."""

    date_insert = dsl.Date()
    importance_level = dsl.Integer()
    label = dsl.String()
    name = dsl.String()
    tag_id = dsl.String(index='not_analyzed')
    type = dsl.Boolean()
