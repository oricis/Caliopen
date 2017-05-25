# -*- coding: utf-8 -*-
"""Caliopen base classes for parsing logic."""
from __future__ import absolute_import, print_function, unicode_literals

import zope.interface


class IAttachmentParser(zope.interface.Interface):
    """Interface for a message attachment parsing."""

    content_type = zope.interface.Attribute('Attachment MIME content type')
    filename = zope.interface.Attribute('Filename if any')
    data = zope.interface.Attribute('Attachment data')
    size = zope.interface.Attribute('Attachment size')
    charset = zope.interface.Attribute('Attachment charset')


class IParticipantParser(zope.interface.Interface):
    """Interface for a message participant parsing."""

    type = zope.interface.Attribute('Participant role type')
    address = zope.interface.Attribute('Participant address')
    label = zope.interface.Attribute('Participant label')


class IMessageParser(zope.interface.Interface):
    """Interface for all message parsers."""

    message_type = zope.interface.Attribute('Type of message')

    raw = zope.interface.Attribute('Raw message')

    subject = zope.interface.Attribute('Message subject if any')
    date = zope.interface.Attribute('Message date')
    size = zope.interface.Attribute('Message size in bytes')
    body = zope.interface.Attribute('Message text body')

    participants = zope.interface.Attribute('List of participants')
    attachments = zope.interface.Attribute('List of attachments')

    external_references = zope.interface.Attribute('External references')
    extra_parameters = zope.interface.Attribute('Extra parameters')
    privacy_features = zope.interface.Attribute('Privacy features')
    headers = zope.interface.Attribute('Headers, protocol specific')
