# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType
from caliopen_storage.store.model import BaseModel


class ExternalReferences(BaseUserType):
    """External references nested in message."""

    ancestors_ids = columns.List(columns.Text())
    message_id = columns.Text()
    parent_id = columns.Text()


class MessageExternalRefLookup(BaseModel):
    """Table to lookup message by external message-id"""

    user_id = columns.UUID(primary_key=True)
    external_msg_id = columns.Text(primary_key=True)
    identity_id = columns.UUID(primary_key=True)
    message_id = columns.UUID()
