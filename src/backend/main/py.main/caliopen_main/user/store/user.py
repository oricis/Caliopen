# -*- coding: utf-8 -*-
"""Caliopen cassandra objects related to user."""

from __future__ import absolute_import, print_function, unicode_literals

import logging
import uuid

from cassandra.cqlengine import columns
from caliopen_storage.store.model import BaseModel
from caliopen_main.pi.objects import PIModel

log = logging.getLogger(__name__)


class UserName(BaseModel):
    """Maintain unicity of user name and permit lookup to user_id."""

    name = columns.Text(primary_key=True)
    user_id = columns.UUID(required=True)


class UserRecoveryEmail(BaseModel):
    """Permit user lookup by recovery_email."""

    recovery_email = columns.Text(primary_key=True)
    user_id = columns.UUID(required=True)


class ReservedName(BaseModel):
    """List of reserved user names."""

    name = columns.Text(primary_key=True)


class User(BaseModel):
    """User main model."""

    user_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    name = columns.Text(required=True)
    password = columns.Text(required=True)
    date_insert = columns.DateTime()
    date_delete = columns.DateTime()
    given_name = columns.Text()
    family_name = columns.Text()
    params = columns.Map(columns.Text, columns.Text)
    contact_id = columns.UUID()
    main_user_id = columns.UUID()
    recovery_email = columns.Text(required=True)
    shard_id = columns.Text()

    privacy_features = columns.Map(columns.Text(), columns.Text())
    pi = columns.UserDefinedType(PIModel)


class FilterRule(BaseModel):
    """User filter rules model."""

    user_id = columns.UUID(primary_key=True)
    rule_id = columns.UUID(primary_key=True)
    date_insert = columns.DateTime()
    name = columns.Text()
    filter_expr = columns.Text()
    position = columns.Integer()
    stop_condition = columns.Boolean()


class Settings(BaseModel):
    """All settings related to an user."""

    user_id = columns.UUID(primary_key=True)
    default_locale = columns.Text()
    message_display_format = columns.Text()
    contact_display_format = columns.Text()
    contact_display_order = columns.Text()
    notification_enabled = columns.Boolean()
    notification_message_preview = columns.Text()
    notification_sound_enabled = columns.Boolean()
    notification_delay_disappear = columns.Integer()


class IndexUser(object):
    """User index management class."""
