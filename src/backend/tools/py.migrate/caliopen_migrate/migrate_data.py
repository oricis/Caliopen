import logging
import uuid

from caliopen_main.user.core.user import User
from caliopen_main.user.core import allocate_user_shard

log = logging.getLogger(__name__)


def migrate_all_users(new_domain, count=None):
    cpt = 0
    for model in User._model_class.all():
        user = User(model)
        shard_id = allocate_user_shard(uuid.UUID(user.user_id))
        if model.shard_id != shard_id:
            model.shard_id = shard_id
            log.info('Allocate user {} to new shard {}'.
                     format(user.user_id, shard_id))
            model.save()
        try:
            local_part = user.name.replace('@', '').lower()
            local_address = '{}@{}'.format(local_part, new_domain)
            ident = user.add_local_identity(local_address)
            log.debug('Created identity {}'.format(ident.identity_id))
        except Exception as exc:
            log.exception('Error during identity creation for user {}: {}'.
                          format(user.user_id, exc))
        cpt += 1
        if count and cpt >= count:
            log.info("Limit to {} users, stop migration".format(count))
            break
