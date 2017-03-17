# -*- coding: utf-8 -*-
"""Caliopen index classes for nested tag."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl
from caliopen_storage.store.model import BaseIndexDocument

log = logging.getLogger(__name__)


class IndexedLocalIdentity(BaseIndexDocument):

    """Local identity indexed model."""

    doc_type = 'indexed_local_identity'

    display_name = dsl.String()
    identifier = dsl.String()
    status = dsl.String()
    type = dsl.String()

