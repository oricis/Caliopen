# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import StringType


class PrivacyFeature(Model):

    name = StringType()
    value = StringType()
    type = StringType()

    class Options:
        serialize_when_none = False
