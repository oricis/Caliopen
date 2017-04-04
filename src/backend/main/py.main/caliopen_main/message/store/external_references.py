# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType


class ExternalReferences(BaseUserType):

    """External references nested in message."""

    discussion_id = columns.Text()
    message_id = columns.Text()
    parent_id = columns.Text()

