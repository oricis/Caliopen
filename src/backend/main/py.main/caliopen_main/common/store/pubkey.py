# -*- coding: utf-8 -*-
"""Caliopen objects related to contact definition."""
from __future__ import absolute_import, print_function, unicode_literals
import datetime
import pytz

from cassandra.cqlengine import columns

from caliopen_storage.store import BaseModel


class PublicKey(BaseModel):
    """Public cryptographic keys model."""

    user_id = columns.UUID(primary_key=True)
    resource_id = columns.UUID(primary_key=True)    # clustering key
    key_id = columns.UUID(primary_key=True)         # clustering key

    resource_type = columns.Text()
    label = columns.Text()

    date_insert = columns.DateTime(default=datetime.datetime.now(tz=pytz.utc))
    date_update = columns.DateTime()
    expire_date = columns.DateTime()

    emails = columns.List(columns.Text())

    key = columns.Text()
    fingerprint = columns.Text()
    size = columns.VarInt()

    # JWT parameters
    kty = columns.Text()    # rsa / ec
    use = columns.Text()    # sig / enc
    alg = columns.Text()    # algorithm
    # Elliptic curve public key parameters (rfc7518 6.2.1)
    crv = columns.Text()
    x = columns.VarInt()
    y = columns.VarInt()
