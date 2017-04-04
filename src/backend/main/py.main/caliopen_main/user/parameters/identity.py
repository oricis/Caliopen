# -*- coding: utf-8 -*-
"""Caliopen user parameters."""

from schematics.models import Model
from schematics.types import (StringType, UUIDType, IntType,
                              DateTimeType, BooleanType, EmailType)
from schematics.types.compound import ModelType, DictType, ListType
from schematics.transforms import blacklist

from .contact import NewContact, Contact


class Identity(Model):
    todo = StringType()
