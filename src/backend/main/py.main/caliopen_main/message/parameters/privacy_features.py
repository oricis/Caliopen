# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import BooleanType


class PrivacyFeatures(Model):
    empty_is_boring = BooleanType()

    class Options:
        serialize_when_none = False
