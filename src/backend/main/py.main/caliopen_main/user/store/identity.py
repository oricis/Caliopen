# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to device."""

from __future__ import absolute_import, print_function, unicode_literals

import logging

from caliopen_storage.store.model import BaseModel

from cassandra.cqlengine import columns

log = logging.getLogger(__name__)


class UserIdentity(BaseModel):
    """User's identities model."""

    user_id = columns.UUID(primary_key=True)
    identity_id = columns.UUID(primary_key=True)
    credentials = columns.Map(columns.Text, columns.Text)
    display_name = columns.Text()
    identifier = columns.Text()
    infos = columns.Map(columns.Text, columns.Text)
    last_check = columns.DateTime()
    protocol = columns.Text()
    status = columns.Text()
    type = columns.Text()
