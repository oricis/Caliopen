# -*- coding: utf-8 -*-
"""Caliopen storage session helpers."""

from cassandra.cqlengine.connection import setup as setup_cassandra
from caliopen.base.config import Configuration


def connect_storage():
    """Connect to storage engines."""
    try:
        from cassandra.io.libevreactor import LibevConnection
        kwargs = {'connection_class': LibevConnection}
    except ImportError:
        kwargs = {}
    setup_cassandra(Configuration('global').get('cassandra.hosts'),
                    Configuration('global').get('cassandra.keyspace'),
                    Configuration('global').get('cassandra.consistency_level'),
                    lazy_connect=True,
                    **kwargs)
