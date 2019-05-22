import logging
import uuid

from cassandra.query import SimpleStatement
from cassandra.cluster import Cluster
from cassandra.query import dict_factory


from caliopen_storage.config import Configuration
from caliopen_storage.exception import NotFound
from caliopen_main.user.core.user import User
from caliopen_main.user.core import allocate_user_shard
from caliopen_main.contact.objects.contact import Contact as ContactObject
from caliopen_main.contact.objects.email import Email as EmailObject

from caliopen_main.contact.core import ContactLookup

log = logging.getLogger(__name__)

EXCLUDE_COLUMS = ['tags']


conf = Configuration('global').configuration
cluster_source = Cluster(conf['old_cassandra']['hosts'])
source = cluster_source.connect(conf['old_cassandra']['keyspace'])
source.row_factory = dict_factory

cluster_dest = Cluster(conf['cassandra']['hosts'])
dest = cluster_dest.connect(conf['cassandra']['keyspace'])


def copy_contacts(user, only_id, filter_id=None):
    query = "SELECT * from contact where user_id = {}".format(user.user_id)
    if filter_id:
        query = "{} AND contact_id = {}".format(query, filter_id)
    statement = SimpleStatement(query, fetch_size=200)
    insert_query = "INSERT INTO contact ({0}) VALUES ({1})"

    contact_ids = []
    for row in source.execute(statement):
        if not only_id:
            columns = []
            values = []
            binds = []
            for col, value in row.items():
                if col not in EXCLUDE_COLUMS:
                    columns.append(col)
                    values.append(value)
                    binds.append('?')

            col_str = ','.join(columns)
            col_bind = ','.join(binds)
            insert_str = insert_query.format(col_str, col_bind)
            insert = dest.prepare(insert_str)
            bound = insert.bind(values)
            dest.execute(bound)
        contact_ids.append(row['contact_id'])
    return contact_ids


def patch_user_contact(user, contact, new_domain, old_domain):
    log.info('Patching user contact')
    update = False
    found = False
    for old_email in contact.emails:
        address = old_email.address.lower()
        log.info('Testing user email addres {}'.format(address))
        if address.endswith(new_domain):
            found = True
        if address.endswith(old_domain):
            update = True
            log.info('Remove old email {}'.format(address))
            contact.emails.remove(old_email)
    if not found:
        update = True
        local_addr = '{}@{}'.format(user.name, new_domain)
        log.info('Creating new email {}'.format(local_addr))
        email = EmailObject(address=local_addr, type='home')
        contact.emails.append(email)

    if update:
        contact.marshall_db()
        contact.save_db()
    return update


def copy_user_contacts(user, new_domain, old_domain, only_index=False,
                       filter_id=None):
    ids = copy_contacts(user, only_index, filter_id)
    for id in ids:
        contact = ContactObject(user, contact_id=id)
        try:
            contact.get_db()
        except NotFound:
            log.error('Contact {} not found for user {}'.
                      format(user.contact_id, user.user_id))
            continue
        contact.unmarshall_db()

        if not only_index:
            if str(user.contact_id) == str(id):
                try:
                    patch_user_contact(user, contact, new_domain, old_domain)
                except Exception as exc:
                    log.exception('Error during user contact patch {}'.
                                  format(user.user_id))
                continue
            for email in contact.emails:
                ContactLookup.create(user=user, contact_id=id,
                                     value=email.address.lower(),
                                     type='email')
            for ident in contact.identities:
                ContactLookup.create(user=user, contact_id=id,
                                     value=ident.name.lower(),
                                     type=ident.type.lower())
        contact.create_index()


def migrate_user(user, new_domain):
    shard_id = allocate_user_shard(uuid.UUID(user.user_id))
    if not shard_id or not user.shard_id:
        log.error('No valid shard')
        return False
    if user.shard_id != shard_id:
        user.model.shard_id = shard_id
        log.info('Allocate user {} to new shard {}'.
                 format(user.user_id, shard_id))
        try:
            user.model.save()
        except Exception as exc:
            log.exception('Fail to save user with new_shard {}'.format(exc))
            return False
        try:
            local_part = user.name.replace('@', '').lower()
            local_address = '{}@{}'.format(local_part, new_domain)
            user.add_local_identity(local_address)
            log.debug('Created local identity {}'.format(local_address))
        except Exception as exc:
            log.exception('Error during identity creation for user {}: {}'.
                          format(user.user_id, exc))
    return True


def migrate_all_users(new_domain, count=None):
    cpt = 0
    for model in User._model_class.all():
        user = User(model)
        migrate_user(user, new_domain)
        cpt += 1
        if count and cpt >= count:
            log.info("Limit to {} users, stop migration".format(count))
            break


def compute_all_shards():
    for model in User._model_class.all():
        shard_id = allocate_user_shard(model.user_id)
        if model.shard_id != shard_id:
            model.shard_id = shard_id
            log.info('Allocate user {} to new shard {}'.
                     format(model.user_id, shard_id))
            model.save()
