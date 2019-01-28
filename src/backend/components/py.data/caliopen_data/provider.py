"""Data provider class for dataset processing."""
from __future__ import absolute_import, print_function, unicode_literals

import os
from io import open

import zope.interface
from elasticsearch import Elasticsearch

from .interface import IDataProvider


class DataProvider(object):
    """Class to interact with a data provider interface."""

    def __init__(self, config):
        """Initialize a data provider, connecting it to store."""
        self.config = config
        self._store = self._connect_store()
        self._search = None
        self.iterator = None

    def prepare(self, query, **kwargs):
        """Prepare the query to be iterated."""
        self._search = self._prepare(query, **kwargs)
        self.iterator = self._execute(**kwargs)

    def next(self):
        """Iterator method over search results."""
        if not self.iterator:
            raise StopIteration
        for item in self.iterator:
            yield self._format_item(item)


class FileDataProvider(DataProvider):
    """Data provider reading from a file."""

    zope.interface.implements(IDataProvider)

    def __init__(self, config):
        """Create a new FileDataProvider."""
        super(FileDataProvider, self).__init__(config)
        self._filename = None

    def _connect_store(self):
        pass

    def _prepare(self, filename, **kwargs):
        if not os.path.isfile(filename):
            raise ValueError('No such file: {0}'.format(filename))
        self._filename = filename

    def _execute(self):
        if not self._filename:
            raise ValueError('No prepared file')
        with open(self._filename, 'r', encoding="utf-8") as f:
            return f.read().split('\n')


class ESProvider(DataProvider):
    """Data provider reading from an elasticsearch query."""

    zope.interface.implements(IDataProvider)

    def _connect_store(self):
        config = self.config.get('elasticsearch')
        return Elasticsearch(config['url'])

    def _prepare(self, query, index=None, doc_type=None, **kwargs):
        self.query = query
        self.query = self.query.using(self._store).index(index). \
            doc_type(doc_type)

    def _execute(self, **kwargs):
        return self.query.scan()
