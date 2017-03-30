# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl

log = logging.getLogger(__name__)


class IndexedExternalReferences(dsl.InnerObjectWrapper):

    """Nest attachment indexed model."""

    discussion_id = dsl.String()
    message_id = dsl.String()
    parent_id = dsl.String()
