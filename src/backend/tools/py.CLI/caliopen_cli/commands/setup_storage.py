"""Setup storage backend."""

import logging
from caliopen_storage.config import Configuration

log = logging.getLogger(__name__)


def setup_storage(settings=None):
    """Create cassandra models."""
    from caliopen_storage.core import core_registry
    # Make discovery happen
    from caliopen_main.user.core import User, Device
    from caliopen_main.contact.objects.contact import Contact
    from caliopen_main.message.objects.message import Message
    from caliopen_main.common.objects.tag import ResourceTag

    from cassandra.cqlengine.management import sync_table, \
        create_keyspace_simple
    keyspace = Configuration('global').get('cassandra.keyspace')
    if not keyspace:
        raise Exception('Configuration missing for cassandra keyspace')
    # XXX tofix : define strategy and replication_factor in configuration
    create_keyspace_simple(keyspace, 1)
    for name, kls in core_registry.items():
        log.info('Creating cassandra model %s' % name)
        if hasattr(kls._model_class, 'pk'):
            # XXX find a better way to detect model from udt
            sync_table(kls._model_class)

    # Add a default admin user
    from caliopen_main.user.core import User
    from caliopen_main.user.parameters import NewUser
    from caliopen_main.contact.parameters import NewContact
    from caliopen_main.contact.parameters import NewEmail

    conf = Configuration('global').configuration

    email_adim = u'{}@{}'.format(conf['default_admin_username'],
                                 conf['default_domain'])

    email = NewEmail()
    email.address = email_adim

    contact = NewContact()
    contact.family_name = conf['default_admin_username']
    contact.emails = [email]

    param = NewUser()
    param.name = conf['default_admin_username']
    param.contact = contact
    param.password = conf['default_admin_password']
    param.recovery_email = email_adim

    user = User.create(param)
    log.info(
        'Admin user <{}> created with user_id: {}'.format(user.name,
                                                          user.user_id))
