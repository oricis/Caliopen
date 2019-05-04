import logging

log = logging.getLogger(__name__)


def clean_all_shards(client, shards, dry_run=True):
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
