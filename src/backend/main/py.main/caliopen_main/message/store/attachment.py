# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType


class MessageAttachment(BaseUserType):

    """Attachment nested in message."""

    content_type = columns.Text()
    file_name = columns.Text()
    is_inline = columns.Boolean()
    size = columns.Integer()
    temp_id = columns.UUID()
    url = columns.Text()  # objectsStore uri for temporary file (draft)
    mime_boundary = columns.Text()  # for attachments embedded in raw messages
