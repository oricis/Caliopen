# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

from elasticsearch_dsl import InnerObjectWrapper, Boolean, Integer, Keyword

log = logging.getLogger(__name__)


class IndexedMessageAttachment(InnerObjectWrapper):

    """Nest attachment indexed model."""

    content_type = Keyword()
    file_name = Keyword()
    is_inline = Boolean()
    size = Integer()
    url = Keyword()  # objectsStore uri for temporary file (draft)
    mime_boundary = Keyword()  # for attachments embedded in raw messages
