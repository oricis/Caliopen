# -*- coding: utf-8 -*-
"""Caliopen storage model for messages."""
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store.model import BaseModel
from caliopen_storage.store.mixin import IndexedModelMixin
from caliopen_main.user.store.tag import ResourceTag
from caliopen_main.user.store.privacy_features import ModelPrivacyFeatures
from caliopen_main.user.store.local_identity import ModelIdentity

from .attachment import ModelMessageAttachment
from .external_references import ModelExternalReferences
from .participant import ModelParticipant
from .message_index import IndexedMessage


import uuid


class Message(BaseModel, IndexedModelMixin):
    """Message model."""

    _index_class = IndexedMessage

    attachments = columns.List(columns.UserDefinedType(ModelMessageAttachment))
    body = columns.Text()
    date = columns.DateTime()
    date_delete = columns.DateTime()
    date_insert = columns.DateTime()
    discussion_id = columns.UUID()
    external_references = columns.List(
        columns.UserDefinedType(ModelExternalReferences))
    identities = columns.List(columns.UserDefinedType(ModelIdentity))
    importance_level = columns.Integer()
    is_answered = columns.Boolean()
    is_draft = columns.Boolean()
    is_unread = columns.Boolean()
    message_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    parent_id = columns.Text()
    participants = columns.List(columns.UserDefinedType(ModelParticipant))
    privacy_features = columns.UserDefinedType(ModelPrivacyFeatures)
    raw_msg_id = columns.UUID()
    subject = columns.Text()  # Subject of email, the message for short
    tags = columns.List(columns.UserDefinedType(ResourceTag))
    type = columns.Text()
    user_id = columns.UUID(primary_key=True)
