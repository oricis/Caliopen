# -*- coding: utf-8 -*-
"""Caliopen parameters for message related classes."""

from schematics.models import Model
from schematics.types import (StringType, DateTimeType,
                              IntType, UUIDType, BooleanType)
from schematics.types.compound import ListType, ModelType
from schematics.transforms import blacklist
from caliopen_main.user.parameters import ResourceTag

RECIPIENT_TYPES = ['to', 'from', 'cc', 'bcc', 'reply-to', 'sender']
MESSAGE_TYPES = ['email']
MESSAGE_STATES = ['draft', 'sending', 'sent', 'cancel',
                  'unread', 'read', 'deleted']


class Attachment(Model):
    content_type = StringType()


class ExternalReferences(Model):
    todo = StringType()


class Identity(Model):
    todo = StringType()


class Participant(Model):
    todo = StringType()


class PrivacyFeatures(Model):
    todo = StringType()

class Recipient(Model):
    """Store a contact reference and one of it's address used in a message."""

    address = StringType(required=True)
    label = StringType(required=True)
    type = StringType(required=True, choices=RECIPIENT_TYPES)
    protocol = StringType(choices=MESSAGE_TYPES)
    contact_id = UUIDType()

    class Options:
        serialize_when_none = False


class Discussion(Model):
    """Existing discussion."""

    user_id = UUIDType()
    discussion_id = UUIDType(required=True)
    date_insert = DateTimeType(serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                               tzd=u'utc')
    date_update = DateTimeType(serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                               tzd=u'utc')
    text = StringType(required=True)
    privacy_index = IntType(required=True, default=0)
    importance_level = IntType(required=True, default=0)
    contacts = ListType(ModelType(Recipient), default=lambda: [])
    total_count = IntType(required=True, default=0)
    unread_count = IntType(required=True, default=0)
    attachment_count = IntType(default=0)

    class Options:
        roles = {'default': blacklist('user_id')}
        serialize_when_none = False


class Part(Model):
    """Message part."""

    content_type = StringType(required=True)
    filename = StringType()
    data = StringType()
    size = IntType()
    can_index = BooleanType()

    class Options:
        serialize_when_none = False


class NewMessage(Model):
    """New message parameter."""

    attachments = ListType(ModelType(Attachment), default=lambda: [])
    body = StringType(required=True)
    date = DateTimeType(required=True,
                        serialized_format="%Y-%m-%dT%H:%M:%S.%f+00:00",
                        tzd=u'utc')
    discussion_id = UUIDType()
    external_references = ModelType(ExternalReferences)
    identities = ListType(ModelType(Identity), default=lambda: [])
    importance_level = IntType(default=0)
    is_answered = BooleanType()
    is_draft = BooleanType()
    is_unread = BooleanType()
    parent_id = StringType()
    participants = ListType(ModelType(Participant),
                          default=lambda: [])
    privacy_features = ModelType(PrivacyFeatures)
    subject = StringType()
    tags = ListType(ModelType(ResourceTag), default=lambda: [])
    type = StringType(required=True, choices=MESSAGE_TYPES)

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

    class Options:
        roles = {'default': blacklist('user_id')}
        serialize_when_none = False
