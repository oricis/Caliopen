"""
Setup storage backend
"""

import logging

log = logging.getLogger(__name__)


def setup_storage(settings):
    from caliopen.config import Configuration
    from caliopen.storage import registry
    from caliopen.storage.data.interfaces import IStorage

    registry.configure(Configuration('global'))
    registry.get_component(IStorage).initialize_db(settings)
    log.info('Storage has been initialized')
