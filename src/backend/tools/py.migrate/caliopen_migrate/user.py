import logging
import uuid

from caliopen_storage.exception import NotFound
from caliopen_main.user.core.user import User
from caliopen_main.user.core import allocate_user_shard
from caliopen_main.contact.objects.contact import Contact as ContactObject
from caliopen_main.contact.objects.email import Email as EmailObject

log = logging.getLogger(__name__)


def fix_user_contact(user, new_domain, only_index=False):
    try:
        contact = ContactObject(user, contact_id=user.contact_id)
        contact.get_db()
        log.info('Found existing contact for user')
        if only_index:
            log.info('Recreate index')
            contact.create_index()
        return None
    except NotFound:
        pass
    except Exception as exc:
        log.exception('Unhandled error retrieving old contact {}'.format(exc))
        raise exc
    try:
        local_addr = '{}@{}'.format(user.name, new_domain)
    except UnicodeError:
        log.error('Invalid user name encoding {}'.format(user.user_id))
        return None
    log.info('Creating user contact')
    obj = ContactObject(user, contact_id=user.contact_id)
    email = EmailObject(address=local_addr, type='home')
    obj.emails.append(email)
    obj.marshall_db()
    obj.save_db()
    obj.create_index()


def migrate_user(model, new_domain):
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
        return False
    return True


def migrate_all_users(new_domain, count=None):
    cpt = 0
    for model in User._model_class.all():
        res = migrate_user(model, new_domain)
        if not res:
            break
        cpt += 1
        if count and cpt >= count:
            log.info("Limit to {} users, stop migration".format(count))
            break
