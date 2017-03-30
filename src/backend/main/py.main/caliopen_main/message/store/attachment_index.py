# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

import elasticsearch_dsl as dsl

log = logging.getLogger(__name__)


class IndexedMessageAttachment(dsl.InnerObjectWrapper):

    """Nest attachment indexed model."""

    content_type = dsl.String()
    is_inline = dsl.Boolean()
    name = dsl.String()
    size = dsl.Integer()
