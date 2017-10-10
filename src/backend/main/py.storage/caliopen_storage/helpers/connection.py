# -*- coding: utf-8 -*-
"""Caliopen storage session helpers."""

from cassandra.cqlengine.connection import setup as setup_cassandra
from elasticsearch import Elasticsearch
from ..config import Configuration


def connect_storage():
    """Connect to storage engines."""
    try:
        from cassandra.io.libevreactor import LibevConnection
        kwargs = {'connection_class': LibevConnection}
    except ImportError:
        kwargs = {}
    hosts = Configuration('global').get('cassandra.hosts')
    keyspace = Configuration('global').get('cassandra.keyspace')
    consistency = Configuration('global').get('cassandra.consistency_level')
    protocol = Configuration('global').get('cassandra.protocol_version')
    setup_cassandra(hosts, keyspace, consistency,
                    lazy_connect=True,
                    protocol_version=protocol,
                    **kwargs)


def get_index_connection():
    """Return a connection to index store."""
    url = Configuration('global').get('elasticsearch.url')
    return Elasticsearch(url)
