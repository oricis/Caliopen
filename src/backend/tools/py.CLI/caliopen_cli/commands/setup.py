"""Setup backend."""

import logging

from .setup_storage import setup_storage
from .setup_notifications_ttls import setup_notifications_ttls

log = logging.getLogger(__name__)


def setup():
    """Setup backend, storage and configuration."""
    log.info('Setup storage')
    setup_storage()
    log.info('Setup notification ttls')
    setup_notifications_ttls()
