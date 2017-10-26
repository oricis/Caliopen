"""Launch of nasic compute on caliopen platform."""
from __future__ import absolute_import, print_function, unicode_literals

import logging


log = logging.getLogger(__name__)


def import_reserved_names(input_file, ** kwargs):
    """Import emails for an user."""
    from caliopen_main.user.core import ReservedName

    cpt = 0
    with open(input_file) as f:
        for name in f.read().decode('utf8').split('\n'):
            if not name.startswith('#'):
                ReservedName.create(name=name)
                cpt += 1
    log.info('Created {} reserved names'.format(cpt))
