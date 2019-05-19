# -*- coding: utf-8 -*-
"""Normalization functions for different values."""
from __future__ import absolute_import, unicode_literals
import logging
from email.utils import parseaddr

log = logging.getLogger(__name__)


def clean_email_address(addr):
    """
    Clean an email address for user resolve.

    Return a tuple (normalized_value, real_value)
    Normalization is : lowercase the real email value and keep + in local part
    """
    real_name, email = parseaddr(addr.replace('\r', ''))
    err_msg = 'Invalid email address {}'.format(addr)
    if not email or '@' not in email:
        log.warn(err_msg)
        return ("", "")
    name, domain = email.lower().split('@', 1)
    if '@' in domain:
        log.error(err_msg)
        return ("", "")

    # unicode everywhere
    return (u'%s@%s' % (name, domain), email)


def clean_twitter_address(addr):
    """Clean a twitter address."""
    return addr.strip('@').lower()
