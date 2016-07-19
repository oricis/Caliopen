"""Setup storage backend."""

import logging
from caliopen.base.config import Configuration

log = logging.getLogger(__name__)


def setup_storage(settings=None):
    """Create cassandra models."""
    from caliopen.base.core import core_registry
    # Make discovery happen
    from caliopen.base.user.core import User
    from caliopen.base.message.core.thread import Thread
    from caliopen.base.message.core.message import Message
    from cassandra.cqlengine.management import sync_table, create_keyspace_simple
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
