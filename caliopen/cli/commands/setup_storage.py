"""
Setup storage backend
"""

import logging

log = logging.getLogger(__name__)


def setup_storage(settings=None):
    from caliopen.storage import registry
    from caliopen.storage.data.interfaces import IStorage

    registry.get_component(IStorage).initialize_db()
    log.info('Storage has been initialized')
