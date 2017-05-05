# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

log = logging.getLogger(__name__)


def includeme(config):
    """Configure API to serve static documentation files."""
    log.info('Loading api doc module')
    settings = config.registry.settings
    swagger_dir = settings.get('pyramid_swagger.schema_directory')
    if not swagger_dir:
        log.warn('No configured swagger schema directory found')
    else:
        log.info('Will load swagger.json from {}'.format(swagger_dir))
        config.add_static_view('doc/api', swagger_dir,
                               cache_max_age=3600)
        # the api swagger-ui is within folder /devtools/swagger-ui
        config.add_static_view('api-ui', 'caliopen_api_doc:swagger-ui/',
                               cache_max_age=3600)
        # the Single Source of Truth
        config.add_static_view('defs', 'caliopen_api_doc:../../defs/',
                               cache_max_age=3600)
