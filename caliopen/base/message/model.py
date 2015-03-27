# -*- coding: utf-8 -*-
"""Caliopen storage model for messages."""

from cqlengine import columns
from caliopen.base.store.model import BaseModel, BaseIndexDocument
from caliopen.base.store.mixin import IndexTagMixin


class RawMessage(BaseModel):

    """Raw message model."""

    user_id = columns.UUID(primary_key=True)
    raw_id = columns.Text(primary_key=True)
    data = columns.Bytes()


class Thread(BaseModel):

    """Thread to group messages model."""

    # XXX threading simplest model, most data are only in index
    user_id = columns.UUID(primary_key=True)
    thread_id = columns.Integer(primary_key=True)  # counter.thread_id
    date_insert = columns.DateTime()
    security_level = columns.Integer()
    subject = columns.Text()


class ThreadRecipientLookup(BaseModel):

    """Lookup thread by a recipient name."""

    # XXX temporary, until a recipients able lookup can be design
    user_id = columns.UUID(primary_key=True)
    recipient_name = columns.Text(primary_key=True)
    thread_id = columns.Integer()


class ThreadExternalLookup(BaseModel):

    """Lookup thread by external_thread_id."""

    user_id = columns.UUID(primary_key=True)
    external_id = columns.Text(primary_key=True)
    thread_id = columns.Integer()


class ThreadMessageLookup(BaseModel):

    """Lookup thread by external message_id."""

    user_id = columns.UUID(primary_key=True)
    external_message_id = columns.Text(primary_key=True)
    thread_id = columns.Integer()
    message_id = columns.Integer()


class Message(BaseModel):

    """Message model."""

    user_id = columns.UUID(primary_key=True)
    message_id = columns.Integer(primary_key=True)  # counter.message_id
    thread_id = columns.Integer()                   # counter.thread_id
    type = columns.Text()
    from_ = columns.Text()
    date = columns.DateTime()
    date_insert = columns.DateTime()
    security_level = columns.Integer()
    subject = columns.Text()  # Subject of email, the message for short
    external_message_id = columns.Text()
    external_parent_id = columns.Text()
    external_thread_id = columns.Text()
    tags = columns.List(columns.Text)
    flags = columns.List(columns.Text)  # Seen, Recent, Deleted, ... IMAP?
    offset = columns.Integer()


class IndexedMessage(BaseIndexDocument, IndexTagMixin):

    """Message from index server with helpers methods."""

    doc_type = 'messages'
    columns = ['message_id', 'type',
               'external_message_id', 'thread_id', 'security_level',
               'subject', 'from_', 'date', 'date_insert',
               'text', 'size', 'answer_to', 'offset', 'headers',
               'tags', 'flags', 'parts', 'contacts',
               ]


class IndexedThread(BaseIndexDocument, IndexTagMixin):

    """Thread from index server."""

    columns = ['thread_id', 'date_insert', 'date_update',
               'security_level', 'slug', 'tags', 'contacts']

    doc_type = 'threads'
