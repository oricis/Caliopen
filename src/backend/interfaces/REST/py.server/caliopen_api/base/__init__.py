# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from .config import includeme

DEFAULT_LIMIT = 20


class Api(object):

    """Base class for all Api."""

    def __init__(self, context, request):
        self.request = request
        self.context = context

    def get_limit(self):
        """Return pagination limit from request else default."""
        return int(self.request.params.get('limit', DEFAULT_LIMIT))

    def get_offset(self):
        """Return pagination offset from request else 0."""
        return int(self.request.params.get('offset', 0))
