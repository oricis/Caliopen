"""Setup storage backend."""

import logging
from caliopen.base.config import Configuration

log = logging.getLogger(__name__)


def setup_storage(settings=None):
    """Create cassandra models."""
    from caliopen.base.core import core_registry
    # Make discovery happen
    from caliopen.base.core.user import User
    from caliopen.base.core.contact import Contact
    from cqlengine.management import sync_table, create_keyspace
    keyspace = Configuration('global').get('cassandra.keyspace')
    if not keyspace:
        raise Exception('Configuration missing for cassandra keyspace')
    # XXX tofix : define strategy and replication_factor in configuration
    create_keyspace(keyspace, 'SimpleStrategy', 1)
    for name, kls in core_registry.items():
        log.info('Creating cassandra model %s' % name)
        sync_table(kls._model_class)
