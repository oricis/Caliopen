import logging

from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import get_index_connection
from caliopen_main.user.core.setups import setup_shard_index

log = logging.getLogger(__name__)


def delete_all_shards(dry_run=True):
    """Delete all index shards."""
    client = get_index_connection()
    shards = Configuration('global').get('elasticsearch.shards')

    for shard in shards:
        log.info('Processing shard {}'.format(shard))
        if not shard.startswith('caliopen-'):
            log.warn('Invalid shard name, pass')
            continue
        if not client.indices.exists(shard):
            log.warn('Shard does not exist')
            continue
        if dry_run:
            log.info('Delete shard but dry run do not touch')
        else:
            client.indices.delete(shard)
            log.info('Index {} deleted'.format(shard))


def create_all_shards(dry_run=True):
    """Create all needed index shards."""
    client = get_index_connection()
    shards = Configuration('global').get('elasticsearch.shards')

    for shard_id in shards:
        if not client.indices.exists(shard_id):
            log.info('Creating shard {}'.format(shard_id))
            if not dry_run:
                setup_shard_index(shard_id)
