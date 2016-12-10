# -*- coding: utf-8 -*-
"""Caliopen storage model for messages."""
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store.model import BaseModel, BaseUserType
from caliopen_storage.store.mixin import IndexedModelMixin

from .message_index import IndexedMessage

import uuid


class RawMessage(BaseModel):

    """Raw message model."""

    user_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    raw_msg_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    data = columns.Bytes()


class MessageRecipient(BaseUserType):

    """Recipient involved in a message."""

    type = columns.Text()
    protocol = columns.Text()
    address = columns.Text()
    contact_id = columns.UUID()
    label = columns.Text()


class Message(BaseModel, IndexedModelMixin):

    """Message model."""

    _index_class = IndexedMessage

    user_id = columns.UUID(primary_key=True)
    message_id = columns.UUID(primary_key=True)
    thread_id = columns.UUID()
    type = columns.Text()
    from_ = columns.Text()
    date = columns.DateTime()
    date_insert = columns.DateTime()
    size = columns.Integer()
    privacy_index = columns.Integer()
    importance_level = columns.Integer()
    subject = columns.Text()  # Subject of email, the message for short
    external_message_id = columns.Text()
    external_parent_id = columns.Text()
    external_thread_id = columns.Text()
    raw_msg_id = columns.UUID()
    tags = columns.List(columns.Text)
    flags = columns.List(columns.Text)  # Seen, Recent, Deleted, ... IMAP?
    offset = columns.Integer()
    state = columns.Text(default='draft')
    recipients = columns.List(columns.UserDefinedType(MessageRecipient))
    text = columns.Text()
