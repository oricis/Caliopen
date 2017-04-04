# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import (StringType,
                              IntType, BooleanType)


class Attachment(Model):
    content_type = StringType()
    is_inline = BooleanType()
    name = StringType()
    size = IntType()

    class Options:
        serialize_when_none = False
