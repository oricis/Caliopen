# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import logging

log = logging.getLogger(__name__)


def includeme(config):
    """Configure REST API for user and contact."""
    log.debug('Loading contact API')
    config.scan('caliopen.api.user.contact')
