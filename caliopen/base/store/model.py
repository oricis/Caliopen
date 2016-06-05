# -*- coding: utf-8 -*-
"""Caliopen cassandra base model classes."""
from __future__ import absolute_import, print_function, unicode_literals
import logging

from cassandra.cqlengine.models import Model
from cassandra.cqlengine.query import DoesNotExist

from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, DocType

from caliopen.base.config import Configuration
from caliopen.base.exception import NotFound
from caliopen.base.helpers.json import to_json, json


log = logging.getLogger(__name__)


class BaseModel(Model):

    """Cassandra base model."""

    __abstract__ = True
    __keyspace__ = Configuration('global').get('cassandra.keyspace')
    _index_class = None

    @classmethod
    def create(cls, **kwargs):
        """Create a new model record."""
        kwargs = {key: val for key, val in kwargs.items()
                  if key in cls._columns}
        obj = super(BaseModel, cls).create(**kwargs)
        if obj._index_class:
            obj.create_index()
        return obj

    @classmethod
    def get(cls, **kwargs):
        """Raise our exception when model not found."""
        try:
            return super(BaseModel, cls).get(**kwargs)
        except DoesNotExist as exc:
            raise NotFound(exc)
        except:
            raise

    @classmethod
    def filter(cls, **kwargs):
        """Filter storable objects."""
        return cls.objects.filter(**kwargs)

    @classmethod
    def all(cls):
        """Return all storable objects."""
        return cls.objects.all()


class BaseIndexDocument(DocType):

    """Base class for indexed objects."""

    doc_type = None
    __url__ = Configuration('global').get('elasticsearch.url')

    @classmethod
    def client(cls):
        """Return an elasticsearch client."""
        return Elasticsearch(cls.__url__)
