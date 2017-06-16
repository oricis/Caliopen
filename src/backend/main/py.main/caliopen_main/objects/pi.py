# -*- coding: utf-8 -*-
"""
Caliopen PI (privacy indexes) definition.

This structure is common to many entities (user, contact, message)
"""
from __future__ import absolute_import, print_function, unicode_literals

import types
from uuid import UUID

from cassandra.cqlengine import columns
import elasticsearch_dsl as dsl
from schematics.models import Model
from schematics.types import IntType

from caliopen_storage.store import BaseUserType
from .base import ObjectIndexable


class PIParameter(Model):
    """The privacy indexes schematics parameter definition."""

    technical = IntType()
    comportment = IntType()
    context = IntType()
    version = IntType()


class PIModel(BaseUserType):
    """The privacy indexes model definition."""

    technical = columns.Integer(default=0)
    comportment = columns.Integer(default=0)
    context = columns.Integer(default=0)
    version = columns.Integer(default=0)
    date_update = columns.DateTime()


class PIIndexModel(dsl.InnerObjectWrapper):
    """The privacy indexes model definition for index part."""

    technical = dsl.Integer()
    comportment = dsl.Integer()
    context = dsl.Integer()


class PIObject(ObjectIndexable):
    """The caliopen object definition of privacy indexes."""

    _attrs = {
        "technical": types.IntType,
        "comportment": types.IntType,
        "context": types.IntType,
        "version": types.IntType,
        "user_id": UUID
    }

    _model_class = PIModel
    _index_class = PIIndexModel
