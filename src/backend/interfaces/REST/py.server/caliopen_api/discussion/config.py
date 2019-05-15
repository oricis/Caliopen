# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

log = logging.getLogger(__name__)


def includeme(config):
    """
    Serve discussion related REST API.
    """

    config.commit()

    log.debug('Loading participants discussion API')
    config.scan('caliopen_api.discussion.participants')
