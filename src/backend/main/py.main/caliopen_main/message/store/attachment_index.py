# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl

log = logging.getLogger(__name__)


class IndexedMessageAttachment(dsl.InnerObjectWrapper):

    """Nest attachment indexed model."""

    content_type = dsl.String()
    file_name = dsl.String()
    is_inline = dsl.Boolean()
    size = dsl.Integer()
    uri = dsl.String()  # objectsStore uri for temporary file (draft)
