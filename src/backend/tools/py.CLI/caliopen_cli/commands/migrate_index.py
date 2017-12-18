# -*- coding: utf-8 -*-

# migrate_index will load the script at the given path
# this script must implement a class named "IndexMigrator"
# with a method "run(elasticsearch_client)"

from __future__ import absolute_import, print_function, unicode_literals

import logging
import imp
import os

from elasticsearch import Elasticsearch
from caliopen_storage.config import Configuration

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.WARN)


def migrate_index(**kwargs):
    Migrator = load_from_file(kwargs["input_script"])
    if Migrator:
        url = Configuration('global').get('elasticsearch.url')
        client = Elasticsearch(url)
        migration = Migrator(client)
        migration.run()


def load_from_file(filepath):
    c = None
    expected_class = 'IndexMigrator'

    mod_name, file_ext = os.path.splitext(os.path.split(filepath)[-1])

    if file_ext.lower() == '.py':
        py_mod = imp.load_source(mod_name, filepath)

    if hasattr(py_mod, expected_class):
        c = getattr(py_mod, expected_class)

    return c
