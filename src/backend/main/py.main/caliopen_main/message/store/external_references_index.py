# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

from elasticsearch_dsl import InnerObjectWrapper, Keyword, Nested

log = logging.getLogger(__name__)


class IndexedExternalReferences(InnerObjectWrapper):

    """Nest attachment indexed model."""

    ancestors_ids = Keyword(multi=True)
    message_id = Keyword()
    parent_id = Keyword()
