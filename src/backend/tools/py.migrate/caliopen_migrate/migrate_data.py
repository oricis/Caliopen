import logging


log = logging.getLogger(__name__)


def prepare_index_shards(client, shards):
    from caliopen_main.user.core.setups import setup_shard_index

    for shard_id in shards:
        if not client.indices.exists(shard_id):
            print('Creating shard {}'.format(shard_id))
            setup_shard_index(shard_id)


def migrate_all_users(new_domain, count=None):
    import uuid
    from caliopen_main.user.core.user import User
    from caliopen_main.user.core import allocate_user_shard
    cpt = 0
    for model in User._model_class.all():
        user = User(model)
        shard_id = allocate_user_shard(uuid.UUID(user.user_id))
        if model.shard_id != shard_id:
            model.shard_id = shard_id
            print('Allocate user {} to shard {}'.
                  format(user.user_id, shard_id))
            model.save()
        try:
            local_part = user.name.replace('@', '').lower()
            local_address = '{}@{}'.format(local_part, new_domain)
            ident = user.add_local_identity(local_address)
            # print('Created identity {}'.format(ident.identity_id))
        except Exception as exc:
            print('Error during identity creation for user {}: {}'.
                  format(user.user_id, exc))
        cpt += 1
        if count and cpt >= count:
            print("Limit to {} users".format(count))
            break
