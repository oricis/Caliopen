# -*- coding: utf-8 -*-
"""Caliopen contact parameters classes."""
from __future__ import absolute_import, print_function, unicode_literals

from schematics.models import Model
from schematics.types import StringType, IntType, BooleanType

MESSAGE_FORMAT_CHOICES = ['rich_text', 'plain_text']
CONTACT_FORMAT_CHOICES = ['given_name, family_name',
                          'family_name, given_name']
CONTACT_ORDER_CHOICES = ['family_name', 'given_name']
PREVIEW_CHOICES = ['off', 'always']
DELAY_CHOICES = [0, 5, 10, 30]


class Settings(Model):
    """Location structure for a device."""

    default_locale = StringType(default='fr-FR')
    message_display_format = StringType(default='rich_text',
                                        choices=MESSAGE_FORMAT_CHOICES)
    contact_display_format = StringType(default='family_name, given_name',
                                        choices=CONTACT_FORMAT_CHOICES)
    contact_display_order = StringType(default='given_name',
                                       choices=CONTACT_ORDER_CHOICES)
    notification_enabled = BooleanType(default=True)
    notification_message_preview = StringType(default='always',
                                              choices=PREVIEW_CHOICES)
    notification_sound_enabled = BooleanType(default=False)
    notification_delay_disappear = IntType(default=10,
                                           choices=DELAY_CHOICES)
