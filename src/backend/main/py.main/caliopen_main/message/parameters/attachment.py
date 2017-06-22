# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import (StringType,
                              IntType, BooleanType)


class Attachment(Model):
    content_type = StringType()
    file_name = StringType()
    is_inline = BooleanType()
    size = IntType()
    url = StringType()  # objectsStore uri for temporary file (draft) or boundary reference for mime-part attachment
    mime_boundary = StringType()  # for attachments embedded in raw messages

    class Options:
        serialize_when_none = False
