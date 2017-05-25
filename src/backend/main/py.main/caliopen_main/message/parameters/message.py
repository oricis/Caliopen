# -*- coding: utf-8 -*-
"""Caliopen parameters for message related classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import (StringType, DateTimeType,
                              IntType, UUIDType, BooleanType)
from schematics.types.compound import ListType, ModelType
from schematics.transforms import blacklist

from .privacy_feature import PrivacyFeature
from .participant import Participant
from .attachment import Attachment
from .external_references import ExternalReferences
from caliopen_main.user.parameters import ResourceTag
from caliopen_main.user.parameters import LocalIdentity


RECIPIENT_TYPES = ['To', 'From', 'Cc', 'Bcc', 'Reply-To', 'Sender']
MESSAGE_TYPES = ['email']
MESSAGE_STATES = ['draft', 'sending', 'sent', 'cancel',
                  'unread', 'read', 'deleted']


class NewMessage(Model):
    """New message parameter."""

    attachments = ListType(ModelType(Attachment), default=lambda: [])
    body = StringType()
    date = DateTimeType(serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                        tzd=u'utc')
    discussion_id = UUIDType()
    external_references = ModelType(ExternalReferences)
    identities = ListType(ModelType(LocalIdentity), default=lambda: [])
    importance_level = IntType()
    is_answered = BooleanType()
    is_draft = BooleanType()
    is_unread = BooleanType()
    parent_id = StringType()
    raw_msg_id = UUIDType()
    participants = ListType(ModelType(Participant),
                            default=lambda: [], required=True)
    privacy_features = ListType(ModelType(PrivacyFeature), default=lambda: [])
    subject = StringType()
    tags = ListType(ModelType(ResourceTag), default=lambda: [])
    type = StringType(choices=MESSAGE_TYPES)

    class Options:
        serialize_when_none = False


class Message(NewMessage):
    """Existing message parameter."""

    user_id = UUIDType()
    message_id = UUIDType(required=True)
    raw_msg_id = UUIDType(required=True)
    date_insert = DateTimeType(required=True,
                               serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                               tzd=u'utc')
    date_delete = DateTimeType()

    class Options:
        roles = {'default': blacklist('user_id', 'date_delete')}
        serialize_when_none = False
