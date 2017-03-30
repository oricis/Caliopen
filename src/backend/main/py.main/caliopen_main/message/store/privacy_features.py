# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType


class PrivacyFeatures(BaseUserType):

    """Privacy features nested in message."""

    empty_is_boring = columns.Boolean()



