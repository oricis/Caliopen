import logging

log = logging.getLogger(__name__)


def includeme(config):
    """
    Serve message and thread REST API.
    """

    config.commit()

    # Activate cornice in any case and scan
    log.debug('Loading message API')
    config.scan('caliopen.api.message.message')
    log.debug('Loading thread API')
    config.scan('caliopen.api.message.thread')
