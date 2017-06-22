# -*- coding: utf-8 -*-
"""Caliopen index classes for nested tag."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

from elasticsearch_dsl import InnerObjectWrapper, Text, Keyword
from caliopen_storage.store.model import BaseIndexDocument

log = logging.getLogger(__name__)


class IndexedLocalIdentity(BaseIndexDocument):
    """Local identity indexed model."""

    doc_type = 'indexed_local_identity'

    display_name = Text()
    identifier = Text()
    status = Keyword()
    type = Keyword()


class IndexedIdentity(InnerObjectWrapper):
    """nested identity within a message"""

    identifier = Text()
    type = Keyword()
