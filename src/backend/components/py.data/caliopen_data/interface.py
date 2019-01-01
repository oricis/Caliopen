"""Data provider interfaces for dataset processing."""
from __future__ import absolute_import, print_function, unicode_literals

import logging

import zope.interface


log = logging.getLogger(__name__)


class IDataProvider(zope.interface.Interface):
    """Base class to be a data provider for ML processing."""

    def _connect_store(self):
        raise NotImplementedError

    def _format_item(self, item):
        """Format a result item from store into processing format."""
        raise NotImplementedError

    def _prepare(self, query, **kwargs):
        raise NotImplementedError

    def _execute(self, **kwargs):
        raise NotImplementedError

    def next(self):
        """Iterator method to retrieve results from provider."""
        raise NotImplementedError
