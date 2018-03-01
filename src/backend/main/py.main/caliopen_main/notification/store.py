# -*- coding: utf-8 -*-
"""Caliopen cassandra models related to device."""

from __future__ import absolute_import, print_function, unicode_literals

from cassandra.cqlengine import columns

from caliopen_storage.store.model import BaseModel


class Notification(BaseModel):
    """
    Table to store notifications queues in cassandra

    user_id: user's id to which notification belongs to.
    timestamp: unix timestamp at which backend created the notification.
    id: universally unique id to unambiguously identify a notification.
    ttl_code: chars to pickup default duration into notifications_ttl table.
    from_ : backend entity that's emitting the message.
    to_ : frontend service/component to which message is sent to.
    type: a single word to describe notification's type: event, info, feedback..
    reference: (optional) a reference number previously sent by frontend.
    body: could be a simple word or a more complex structure like a json.

    """

    user_id = columns.UUID(primary_key=True)
    timestamp_ = columns.DateTime(primary_key=True)
    id = columns.UUID(primary_key=True)
    ttl_code = columns.Ascii()
    from_ = columns.Text()
    to_ = columns.Text()
    type = columns.Ascii()
    reference = columns.Text()
    body = columns.Blob()


class Notification_ttl(BaseModel):
    """
    Table to store ttl configuration for each kind of notification

    ttl_code: chars to identify a ttl.
    ttl_duration: default duration for this kind of ttl
    description: free text description
    """

    ttl_code = columns.Ascii(primary_key=True)
    ttl_duration = columns.Integer()
    description = columns.Text()
