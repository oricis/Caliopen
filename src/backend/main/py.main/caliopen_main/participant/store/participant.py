# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns
from caliopen_storage.store import BaseUserType, BaseModel


class Participant(BaseUserType):
    """participant nested in message."""

    address = columns.Text()
    contact_ids = columns.List(columns.UUID())
    participant_id = columns.UUID()
    label = columns.Text()
    protocol = columns.Text()
    type = columns.Text()


class ParticipantLookup(BaseModel):
    """
    Table to store two ways links between participants, contacts and discussions

    source and destination are URIs in the form of "scheme:path"
     - for a contact : "contact:03b84039-348e-4f78-ae06-aa12130fe381"
     - for a participant : "email:john@example.com", "twitter:caliopen_org"

    It is updated each time :
        - a message gets in or out (including draft edition)
        - a participant is added/removed from a contact
    """

    user_id = columns.UUID(primary_key=True)
    uri = columns.Text(primary_key=True)
    hash = columns.Text(primary_key=True)
    hash_components = columns.List(columns.Text())
    date_insert = columns.DateTime()
