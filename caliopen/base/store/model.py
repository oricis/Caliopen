# -*- coding: utf-8 -*-
"""Caliopen cassandra base model classes."""
import logging

from cassandra.cqlengine.models import Model
from cassandra.cqlengine.query import DoesNotExist

from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

from caliopen.base.config import Configuration
from caliopen.base.exception import NotFound
from caliopen.base.helpers.json import to_json, json


log = logging.getLogger(__name__)


class BaseModel(Model):

    """Cassandra base model."""

    __abstract__ = True
    __keyspace__ = Configuration('global').get('cassandra.keyspace')

    @classmethod
    def create(cls, **kwargs):
        """Create a new model record."""
        kwargs = {key: val for key, val in kwargs.items()
                  if key in cls._columns}
        return super(BaseModel, cls).create(**kwargs)

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


class BaseIndexDocument(object):

    """Base class for indexed objects."""

    columns = []
    doc_type = None
    __url__ = Configuration('global').get('elasticsearch.url')

    def __init__(self, data):
        """Create a BaseIndexDocument instance from a dict.

        :param data: Elasticsearch result dict.
        :type data: dict
        """
        # XXX : tofix, need to handle better ES result
        if '_source' in data:
            data = data['_source']
        for col in self.columns:
            setattr(self, col, data.get(col, None))

    @classmethod
    def client(cls):
        """Return an elasticsearch client."""
        return Elasticsearch(cls.__url__)

    @classmethod
    def get(cls, user_id, uid):
        """Get an indexed object."""
        res = cls.client().get(index=user_id, doc_type=cls.doc_type, id=uid)
        if res:
            obj = cls(res)
            # XXX : design problem, we should not do this
            setattr(obj, 'user_id', user_id)
            setattr(obj, 'uid', uid)
            return obj
        raise NotFound('Index %s/%s/%s not found' %
                       (user_id, cls.doc_type, uid))

    def refresh(self):
        """Refresh instance with stored values."""
        self = self.get(self.user_id, self.uid)

    def update(self, query):
        """Update indexed object running query."""
        # XXX surely not secure
        client = self.client()
        res = client.update(index=self.user_id,
                            doc_type=self.doc_type,
                            id=self.uid,
                            body=to_json(query))
        return res

    def update_field_add(self, field, value):
        """Add a value to a given field in index."""
        query = {
            'script': 'ctx._source.%s += attrs' % field,
            'params': {'attrs': value}
        }
        return self.update(query)

    def update_field_delete(self, field, value):
        """Delete a value from a given field in index."""
        query = {
            'script': 'ctx._source.%s -= attrs' % field,
            'params': {'attrs': value}
        }
        return self.update(query)

    @classmethod
    def create(cls, core, **kwargs):
        """Create an indexed object."""
        uid = getattr(core, core._pkey_name)
        data = {column: kwargs.get(column, getattr(core, column))
                for column in cls.columns}
        # XXX TOFIX HACKISH : encode UUID using json encoder
        data = json.loads(to_json(data))
        return cls.client().create(index=core.user_id,
                                   doc_type=cls.doc_type,
                                   id=uid, body=data)

    @classmethod
    def _format_list_result(cls, res):
        results = []
        for idx in res:
            results.append(idx.to_dict())
        return {'total': res.hits.total, 'data': results}

    @classmethod
    def filter(cls, user_id, params, order=None, limit=None, offset=0):
        """Filter indexed objects using a query string.

        :param user_id: user identifier
        :type user_id: str
        :param params: parameters to add in query string, will be
                       form of name:value
        :type params: dict
        :param limit: restrict result to this limit
        :type limit: int
        :param offset: start result list from this offset
        :type offset: int

        :return list
        """
        # XXX well I know this it bad, security must be considered strongly
        values = []
        for k, v in params.iteritems():
            values.append('%s:%s' % (k, v))
        q_str = ' AND '.join(values)

        client = cls.client()
        s = Search(using=client, index=user_id, doc_type=cls.doc_type). \
            query("query_string", query=q_str)
        if limit or offset:
            s = s[offset:(offset + limit)]
        log.debug("Filter index %s %s with : %s" %
                  (user_id, cls.doc_type, s.to_dict()))
        res = s.execute()
        return cls._format_list_result(res)

    @classmethod
    def all(cls, user_id, order=None, limit=None, offset=0):
        """Return all indexed objects with limits and sort options.

        :param user_id: user identifier
        :type user_id: str
        :param limit: restrict result to this limit
        :type limit: int
        :param offset: start result list from this offset
        :type offset: int

        :return list
        """
        client = cls.client()
        s = Search(using=client, index=user_id, doc_type=cls.doc_type)
        if limit or offset:
            s = s[offset:(offset + limit)]
        res = s.execute()
        return cls._format_list_result(res)

    @classmethod
    def dump(cls, user_id):
        """Dump indexed objects with their id for an user.

        :param user_id: user identifier
        :type user_id: str
        """
        client = cls.client()
        s = Search(using=client, index=user_id, doc_type=cls.doc_type)
        # XXX do count and adjust limit to be sure to get everything
        s = s[0:100]
        res = s.execute()
        results = []
        for doc in res:
            url = '%s/%s/%s' % (user_id, cls.doc_type, doc._meta.id)
            results.append({
                'id': doc._meta.id,
                'url': url,
                'body': doc.to_dict(),
                })
        if len(results) >= 100:
            log.warn('Only 100 indexed objects %s dumped' % cls.doc_type)
        return results

    def to_dict(self):
        """Return indexed object instance as dict."""
        data = {}
        for col in self.columns:
            # XXX only not none columns ?
            data.update({col: getattr(self, col)})
        return data
