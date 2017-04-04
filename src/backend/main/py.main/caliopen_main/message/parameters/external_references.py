# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import StringType


class ExternalReferences(Model):
    discussion_id = StringType()
    message_id = StringType()
    parent_id = StringType()

    class Options:
        serialize_when_none = False
