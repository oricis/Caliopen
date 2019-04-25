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


class HashLookup(BaseModel):
    """
    Table to lookup in which hash(es) an uri is embedded

    URIs in the form of "scheme:path"
     - for example : "email:john@example.com", "twitter:caliopen_org"

    It is updated each time a message gets in or out (including draft edition)
    """

    user_id = columns.UUID(primary_key=True)
    uri = columns.Text(primary_key=True)
    hash = columns.Text(primary_key=True)
    hash_components = columns.List(columns.Text())
    date_insert = columns.DateTime()


class ParticipantHash(BaseModel):
    """
    Table to store two ways links between uris'hash (immutable message's prop.)
    and corresponding current participants'hash

    It is updated each time :
        - a lookup is made on one uris'hash,
                            but its participant hash counterpart does not exist
        - a participant is added/removed from a contact
    """

    user_id = columns.UUID(primary_key=True)
    kind = columns.Text(primary_key=True)  # 'uris' or 'participants'
    key = columns.Text(primary_key=True)  # uris or partcipants' hash
    value = columns.Text(primary_key=True)  # the hash of opposite kind
    components = columns.List(columns.Text())  # what hash is made of
    date_insert = columns.DateTime()
