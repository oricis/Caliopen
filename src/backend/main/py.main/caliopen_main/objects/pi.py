# -*- coding: utf-8 -*-
"""
Caliopen PI (privacy indexes) definition.

This structure is common to many entities (user, contact, message)
"""
from __future__ import absolute_import, print_function, unicode_literals

import types
from uuid import UUID

from cassandra.cqlengine import columns
from elasticsearch_dsl import InnerObjectWrapper, Integer, Date
from schematics.models import Model
from schematics.types import IntType, DateTimeType

from caliopen_storage.store import BaseUserType
from .base import ObjectIndexable


class PIParameter(Model):
    """The privacy indexes schematics parameter definition."""

    technic = IntType()
    comportment = IntType()
    context = IntType()
    version = IntType()
    date_update = DateTimeType()


class PIModel(BaseUserType):
    """The privacy indexes model definition."""

    comportment = columns.Integer(default=0)
    context = columns.Integer(default=0)
    date_update = columns.DateTime()
    technic = columns.Integer(default=0)
    version = columns.Integer(default=0)


class PIIndexModel(InnerObjectWrapper):
    """The privacy indexes model definition for index part."""

    comportment = Integer()
    context = Integer()
    date_update = Date()
    technic = Integer()
    version = Integer()


class PIObject(ObjectIndexable):
    """The caliopen object definition of privacy indexes."""

    _attrs = {
        "comportment": types.IntType,
        "context": types.IntType,
        "technic": types.IntType,
        "version": types.IntType,
    }

    _model_class = PIModel
    _index_class = PIIndexModel
