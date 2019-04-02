
import sys

from cassandra.cluster import Cluster
from cassandra.query import SimpleStatement
from cassandra.query import dict_factory

from caliopen_storage.config import Configuration


def copy_model(**kwargs):
    conf = Configuration('global').configuration
    cluster_source = Cluster(conf['cassandra']['hosts'])
    source = cluster_source.connect(conf['cassandra']['keyspace'])
    source.row_factory = dict_factory
    cluster_dest = Cluster(conf['new_cassandra']['hosts'])
    dest = cluster_dest.connect(conf['new_cassandra']['keyspace'])

    table = kwargs['model'].lower()
    query = "SELECT * from {0}".format(table)
    statement = SimpleStatement(query, fetch_size=100)
    insert_query = "INSERT INTO {0} ({1}) VALUES ({2})"
    cpt = 0
    insert = None
    for row in source.execute(statement):
        if cpt == 0:
            columns = row.keys()
            binds = ['?' for x in range(0, len(columns))]
            insert_str = insert_query.format(table,
                                             ','.join(columns),
                                             ','.join(binds))
            insert = dest.prepare(insert_str)
        bound = insert.bind(row.values())
        dest.execute(bound)
        cpt += 1
    print('Copy of {} records from {}'.format(cpt, table))
    return cpt
