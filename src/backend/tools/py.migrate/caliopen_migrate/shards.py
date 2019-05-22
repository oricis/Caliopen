import logging

from caliopen_storage.config import Configuration
from caliopen_storage.helpers.connection import get_index_connection
from caliopen_main.user.core.setups import setup_shard_index
from caliopen_main.user.core import User

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


def recreate_user_alias(client, user, dry_run=True):
    """Create an index alias mapping user_id -> shard_id."""
    if not user.shard_id:
        log.error('No shard for user {}'.format(user.user_id))
        return False
    shards = Configuration('global').get('elasticsearch.shards')
    alias_exists = False
    if client.indices.exists_alias(name=user.user_id):
        alias = client.indices.get_alias(name=user.user_id)
        for index, alias_infos in alias.items():
            if index not in shards:
                if not dry_run:
                    client.indices.delete_alias(index=index, name=user.user_id)
                else:
                    log.info('Alias exist {} with index {}, should delete'.
                             format(user.user_id, index))
            else:
                log.info('Alias on shard exist, skipping')
                alias_exists = True
    if alias_exists:
        return True
    if not dry_run:
        body = {'filter': {'term': {'user_id': user.user_id}}}
        try:
            client.indices.put_alias(index=user.shard_id,
                                     name=user.user_id,
                                     body=body)
        except Exception as exc:
            log.exception('Error during alias creation for user {} : {}'.
                          format(user.user_id, exc))
            return False
    else:
        log.info('Should create alias {}'.format(user.user_id))
    return True


def recreate_all_user_aliases(dry_run=True):
    """Recreate alias for all users."""
    client = get_index_connection()
    for user in User._model_class.all():
        recreate_user_alias(client, user, dry_run)
