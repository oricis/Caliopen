# -*- coding: utf-8 -*-
"""Normalization functions for different values."""
from __future__ import absolute_import, unicode_literals
import logging
from email.utils import parseaddr

log = logging.getLogger(__name__)


def clean_email_address(addr):
    """Clean an email address for user resolve."""
    real_name, email = parseaddr(addr.replace('\r', ''))
    err_msg = 'Invalid email address {}'.format(addr)
    if not email or '@' not in email:
        log.warn(err_msg)
        return ("", "")
    name, domain = email.lower().split('@', 1)
    if '@' in domain:
        log.error(err_msg)
        return ("", "")
    if '+' in name:
        try:
            name, ext = name.split('+', 1)
        except Exception as exc:
            log.info(exc)
    # unicode everywhere
    return (u'%s@%s' % (name, domain), email)

def clean_twitter_address(addr):
    return addr.strip('@').lower()