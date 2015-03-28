import logging

log = logging.getLogger(__name__)


def includeme(config):
    """
    Serve message and thread REST API.
    """

    config.commit()

    # Activate cornice in any case and scan
    log.debug('Loading message and thread API')
    config.scan('caliopen.api.message.message')
    config.scan('caliopen.api.message.thread')
