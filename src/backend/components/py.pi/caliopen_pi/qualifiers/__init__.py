# -*- coding: utf-8 -*-
"""Caliopen user message qualification logic."""
from __future__ import absolute_import, print_function, unicode_literals

from .mail import UserMessageQualifier
from .contact import ContactEmailQualifier, ContactMessageQualifier

__all__ = ['UserMessageQualifier',
           'ContactEmailQualifier',
           'ContactMessageQualifier']
