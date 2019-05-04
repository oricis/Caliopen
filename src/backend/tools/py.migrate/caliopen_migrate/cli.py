from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import get_index_connection


es_client = get_index_connection()
shards = Configuration('global').get('elasticsearch.shards')

