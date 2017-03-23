# -*- coding: utf-8 -*-
"""Caliopen tag objects."""
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseUserType


class Participant(BaseUserType):

    """participant nested in message."""

    address = columns.Text()
    contact_ids = columns.List(columns.UUID())
    label = columns.Text()
    protocol = columns.Text()
    type = columns.Text()

