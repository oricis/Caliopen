# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging

from .authentication import AuthenticationPolicy

log = logging.getLogger(__name__)


def includeme(config):
    """Configure REST API for user and contact."""
    config.set_authentication_policy(AuthenticationPolicy())

    log.debug('Loading contact API')
    config.scan('caliopen.api.user.contact')
