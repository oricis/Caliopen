"""Data elasticsearch provider class for dataset processing."""
from __future__ import absolute_import, print_function, unicode_literals

from caliopen_data import ESProvider

import logging
import zope.interface

from elasticsearch import Elasticsearch


log = logging.getLogger(__name__)


class ESQuery(ESProvider):

    def _format_item(self, item):
        return [",".join(x['label'] for x in item.participants)]
