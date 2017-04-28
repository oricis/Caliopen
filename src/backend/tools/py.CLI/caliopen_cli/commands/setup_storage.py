"""Setup storage backend."""

import logging
from caliopen_storage.config import Configuration

log = logging.getLogger(__name__)


def setup_storage(settings=None):
    """Create cassandra models."""
    from caliopen_storage.core import core_registry
    # Make discovery happen
    from caliopen_main.user.core import User, Device
    from caliopen_main.discussion.core.discussion import Discussion
    from caliopen_main.objects.contact import (Contact, ContactLookup,
                                               PublicKey)
    from caliopen_main.objects.device import Device, DeviceLocation
    from caliopen_main.objects.identities import (LocalIdentity,
                                                  SocialIdentity)
    from caliopen_main.objects.message import Message
    from caliopen_main.objects.tag import ResourceTag, UserTag

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
